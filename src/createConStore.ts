import { useSyncExternalStore, } from 'react';
import type { CreateConReturnType, } from './_internal/createCon';
import defaultSelector from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import isPlainObject from './_internal/isPlainObject';
import useSelectorCallback from './_internal/useSelectorCallback';
import type { ActRecord, } from './types/ActRecord';
import type { DefaultSelector, } from './types/DefaultSelector';
import type { DS, } from './types/DS';
import type { Initial, } from './types/Initial';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';

/**
 * Type definition for the return value of createConStore.
 * Combines the return type of createConBase with a function signature that accepts an optional selector.
 *
 * @typeParam {DS} S - The type of the state object
 * @typeParam {ActRecord} A - The type of the actions record
 */
type CreateConStoreReturnType<
	S extends DS,
	AR extends ActRecord,
	Sel extends Selector<S, AR>,
> = CreateConReturnType<S, AR> & {
	(): ReturnType<Sel extends Selector<S, AR> ? Sel : DefaultSelector<S, AR>>
	<Sel extends Selector<S, AR>,>( select: Sel ): ReturnType<Sel>
};

/**
 * Creates a global state store with history tracking and subscription through React's {@link useSyncExternalStore} capabilities.
 * Similar to {@link useCon} but for managing global state that persists across component unmounts.
 *
 * @example
 * Basic usage
 * ```ts
 * // Create a store
 * const useStore = createConStore({
 *   user: { name: '', age: 0 },
 *   settings: { theme: 'light' }
 * });
 *
 * // Use in components
 * function UserProfile() {
 *   const [state, { set }] = useStore();
 *   return (
 *     <input
 *       value={state.user.name}
 *       onChange={e => set('user.name', e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @typeParam S - The {@link DS data structure (DS)} that can be used.
 * @typeParam AR - {@link ActRecord Action record} that will return from {@link CreateActs options.acts}
 * @typeParam Sel - {@link Selector}
 *
 * @param initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param [options] - Configuration {@link Option options}.
 *
 * @param {CreateActs} [options.acts] - {@link CreateActs} A callback function that creates reusable actions for state management.
 * Takes control props (set, get, reset, etc.) and returns an object of action functions that can be asynchronous.
 *
 * @example
 * `options.acts` example
 * ```ts
 * const useStoreWithActions = createConStore(
 *   { count: 0 },
 *   {
 *     acts: (controls) => ({
 *       increment: () => controls.set(draft => { draft.count++ }),
 *       decrement: () => controls.set(draft => { draft.count-- })
 *     })
 *   }
 * );
 *
 * // Call the actions in components
 * const [state, controls] = useStoreWithActions();
 * controls.acts.increment();
 * controls.acts.decrement();
 * ```
 *
 * @param {OptionAfterChange} [options.afterChange] - {@link OptionAfterChange} A callback that runs after state changes are dispatched.
 * Receives the immutable history object containing the current state, changes, and previous states.
 * Can be async and return a Promise or void.
 *
 * @example
 * `options.afterChange` example
 * ```ts
 * const useStoreWithAfterChange = createConStore(
 *   { count: 0 },
 *   {
 *     afterChange: async (history) => {
 *       // Access state after change
 *       console.log('New count:', history.state.count);
 *       // Access previous state
 *       console.log('Previous count:', history.prev?.count);
 *     }
 *   }
 * );
 * ```
 *
 * @param {MutOptions} [options.mutOptions] - {@link MutOptions} Configuration options for the Mutative library's state updates.
 * Controls how drafts are created and modified. Supports all Mutative options except `enablePatches`.
 * See {@link https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options Mutative Options}
 *
 * @example
 * `options.mutOptions` example
 * ```ts
 * const useStoreWithMutOptions = createConStore(
 *   { items: [] },
 *   {
 *     mutOptions: {
 *       strict: true, // Throws on illegal mutations
 *       enableAutoFreeze: true, // Automatically freezes produced states
 *       enableMapSet: true // Enable Map/Set support
 *     }
 *   }
 * );
 * ```
 *
 * @param {OptionTransform} [options.transform] - {@link OptionTransform} A callback to transform state before it's updated.
 * Receives a mutable draft of both state and initial values, allowing you to modify them before changes are applied.
 * Called during set and reset operations with the corresponding action type.
 *
 * @example
 * `options.transform` example
 * ```ts
 * const useStoreWithTransform = createConStore(
 *   { count: 0 },
 *   {
 *     transform: (draft, history, type) => {
 *       // Ensure count never goes below 0
 *       if (type === 'set' && history.state.count < 0) {
 *         draft.state.count = 0;
 *       }
 *
 *       // Reset to initial + 1
 *       if (type === 'reset') {
 *         draft.state.count = history.initial.count + 1;
 *       }
 *     }
 *   }
 * );
 * ```
 *
 * @param {Selector} [selector=DefaultSelector] - {@link Selector} A function to customize the shape of the returned state.
 * By {@link DefaultSelector default}, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @returns A React hook function that provides access to the store's state and controls.
 * The hook's return type depends on the selector:
 * - With default selector: Returns `[state, controls]` tuple where:
 *   - `state`: The current state
 *   - `controls` contains all state management {@link CreateActsProps methods} `&` {@link History}
 *     - State Methods:
 *       - `set(pathOrCallback, valueOrCallback?)`: Set state at path or with updater function
 *       - `setWrap(pathOrCallback, valueOrCallback?)`: Like set but returns a function for additional args
 *       - `currySet(pathOrCallback)`: Returns a function to set state at path
 *       - `reset()`: Reset state to initial or transformed initial
 *     - History Methods:
 *       - `setHistory(pathOrCallbackOrStateAndHistory, valueOrCallback?)`: Direct history manipulation of `state` or `initial` properties at path or with updater function.
 *       - `setHistoryWrap(pathOrCallback, valueOrCallback?)`: Like setHistory but returns a function for additional args.
 *       - `currySetHistory(pathOrCallback)`: Returns a function for updating `state` or `initial` properties at path
 *     - Query Methods:
 *       - `get(path?)`: Get `state` and `initial`, or value at path
 *       - `getDraft(pathOrMutOptions?, mutOptions?)`: Get mutable draft at path.
 *          Accepts `path` or `mutOptions` to mutate `state` and/or `initial` properties.
 *          Returns `[draft, finalize]`.
 *     - {@link History} Properties:
 *       - `initial`: Initial state
 *       - `state`: Current state
 *       - `changes`: Partial changes from initial
 *       - `prev`: Previous state if changed
 *       - `prevInitial`: Previous initial if changed
 * - With custom selector: Returns whatever shape the selector returns. You have access to `controls` via parameter.
 *
 * @example
 * `selector` example
 * ```ts
 * // Default selector usage: [state, controls]
 * const useStore = createConStore({ count: 0 });
 *
 * // Use in component
 * function Component() {
 *   const [state, controls] = useStore();
 *  }
 *
 * // Custom selector usage
 * const useStoreWithSelector = createConStore(
 *   { count: 0 },
 *   {
 *     acts: controls => ({
 *       increment: () => controls.set(draft => { draft.count++ })
 *     })
 *   },
 *   // Custom selector
 *   ({ state, acts }) => ({
 *     count: state.count,
 *     increment: acts.increment
 *   })
 * );
 *
 * // Use in component
 * function Component() {
 *   const {count, increment} = useStoreWithSelector();
 * }
 *
 * // Overwrite selector
 * function Component() {
 *   const {count, increment} = useStoreWithSelector(({ state, setWrap }) => ({
 *     count: state.count,
 *     increment: setWrap(draft => { draft.count++ })
 *   }));
 * }
 * ```
 */
export default function createConStore<
	S extends DS,
	AR extends ActRecord,
	Sel extends Selector<S, AR> = DefaultSelector<S, AR>,
>(
	initial: Initial<S>,
	options?: Option<S, AR>,
	selector?: Sel
): CreateConStoreReturnType<
	S,
	AR,
	Sel
>;
/**
 * Creates a global state store with history tracking and subscription through React's {@link useSyncExternalStore} capabilities.
 * Similar to {@link useCon} but for managing global state that persists across component unmounts.
 *
 * @example
 * Basic usage
 * ```ts
 * // Create a store
 * const useStore = createConStore({
 *   user: { name: '', age: 0 },
 *   settings: { theme: 'light' }
 * });
 *
 * // Use in components
 * function UserProfile() {
 *   const [state, { set }] = useStore();
 *   return (
 *     <input
 *       value={state.user.name}
 *       onChange={e => set('user.name', e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @typeParam S - The {@link DS data structure (DS)} that can be used.
 * @typeParam AR - {@link ActRecord Action record} that will return from {@link CreateActs options.acts}
 * @typeParam Sel - {@link Selector}
 *
 * @param initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param {Selector} [selector=DefaultSelector] - {@link Selector} A function to customize the shape of the returned state.
 * By {@link DefaultSelector default}, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @returns A React hook function that provides access to the store's state and controls.
 * The hook's return type depends on the selector:
 * - `controls` contains all state management {@link CreateActsProps methods} `&` {@link History}
 *   - State Methods:
 *     - `set(pathOrCallback, valueOrCallback?)`: Set state at path or with updater function
 *     - `setWrap(pathOrCallback, valueOrCallback?)`: Like set but returns a function for additional args
 *     - `currySet(pathOrCallback)`: Returns a function to set state at path
 *     - `reset()`: Reset state to initial or transformed initial
 *   - History Methods:
 *     - `setHistory(pathOrCallbackOrStateAndHistory, valueOrCallback?)`: Direct history manipulation of `state` or `initial` properties at path or with updater function.
 *     - `setHistoryWrap(pathOrCallback, valueOrCallback?)`: Like setHistory but returns a function for additional args.
 *     - `currySetHistory(pathOrCallback)`: Returns a function for updating `state` or `initial` properties at path
 *   - Query Methods:
 *     - `get(path?)`: Get `state` and `initial`, or value at path
 *     - `getDraft(pathOrMutOptions?, mutOptions?)`: Get mutable draft at path.
 *        Accepts `path` or `mutOptions` to mutate `state` and/or `initial` properties.
 *        Returns `[draft, finalize]`.
 *   - {@link History} Properties:
 *     - `initial`: Initial state
 *     - `state`: Current state
 *     - `changes`: Partial changes from initial
 *     - `prev`: Previous state if changed
 *     - `prevInitial`: Previous initial if changed
 * - With custom selector: Returns whatever shape the selector returns
 *
 * @example
 * `selector` example
 * ```ts
 * // Default selector usage: [state, controls]
 * const useStore = createConStore({ count: 0 });
 *
 * // Use in component
 * function Component() {
 *   const [state, controls] = useStore();
 *  }
 *
 * // Custom selector usage
 * const useStoreWithSelector = createConStore(
 *   { count: 0 },
 *   // Custom selector
 *   ({ state, setWrap }) => ({
 *     count: state.count,
 *     increment: setWrap(draft => { draft.count++ })
 *   })
 * );
 *
 * // Use in component
 * function Component() {
 *   const {count, increment} = useStoreWithSelector();
 * }
 *
 * // Overwrite selector
 * function Component() {
 *   const {count, increment} = useStoreWithSelector(({ state, setWrap }) => ({
 *     count: state.count,
 *     increment: setWrap(draft => { draft.count++ })
 *   }));
 * }
 * ```
 */
export default function createConStore<
	S extends DS,
	Sel extends Selector<S, Record<never, never>>,
>(
	initial: Initial<S>,
	selector: Sel,
): CreateConStoreReturnType<
	S,
	Record<never, never>,
	Sel
>;
export default function createConStore<
	S extends DS,
	AR extends ActRecord,
>(
	initial: Initial<S>,
	options?: unknown,
	selector?: unknown,
) {
	const [
		opts,
		sel,
	] = isPlainObject( options, )
		? [options as Option<S, AR>, ( selector ?? defaultSelector<S, AR> ) as Selector<S, AR>,]
		: [{} as Option<S, AR>, ( options ?? defaultSelector<S, AR> ) as Selector<S, AR>,];
	const estadoSubLis = createConSubLis(
		typeof initial === 'function' ? initial() : initial,
		{
			...opts,
			dispatcher( nextHistory, ) {
				snapshot = {
					...nextHistory,
					...estado,
				};
				listeners.forEach( listener => listener( snapshot, ), );
			},
		},
	);
	const {
		subscribe,
		listeners,
		...estado
	} = estadoSubLis;
	const initialSnapshot = {
		...estado.get(),
		...estado,
	};
	let snapshot = initialSnapshot;
	function useConSelector<Sel extends Selector<S, AR>,>( select?: Sel, ) {
		const selectorCallback = useSelectorCallback<S, AR>(
			sel,
			select,
		);
		// @see {@link https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js}
		return useSyncExternalStore(
			subscribe,
			() => selectorCallback( snapshot, ),
			() => selectorCallback( initialSnapshot, ),
		);
	}

	return Object.assign(
		useConSelector,
		estado,
	);
}
