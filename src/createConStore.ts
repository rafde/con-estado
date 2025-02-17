import { useCallback, useSyncExternalStore, } from 'react';
import type { CreateConStoreReturnType, } from '../types/CreateConStoreReturnType';
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
 * @param {DS} initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param {Option} [options] - Configuration {@link Option options}.
 *
 * @param {Option.acts} [options.acts] - A {@link Option.acts function} that creates reusable actions for state management.
 * Takes control props (set, get, reset, etc.) and returns an object of action functions that can be asynchronous.
 *
 * @param {Option.afterChange} [options.afterChange] - A {@link Option.afterChange function} that runs after state changes are dispatched.
 * Receives the immutable history object containing the current state, changes, and previous states.
 * Can be async and return a Promise or void.
 *
 * @param {MutOptions} [options.mutOptions] - Configuration {@link MutOptions options} for the Mutative library's state updates.
 * Controls how drafts are created and modified. Supports all Mutative options except `enablePatches`.
 * See {@link https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options Mutative Options}
 *
 * @param {Option.transform} [options.transform] - A {@link Option.transform function} to transform state before it's updated.
 * Receives a mutable draft of both state and initial values, allowing you to modify them before changes are applied.
 * Called during set and reset operations with the corresponding action type.
 *
 * @param {Selector} [selector=DefaultSelector] - A {@link Selector function} to customize the shape of the returned state.
 * By {@link DefaultSelector default}, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @returns A React hook function that provides access to the store's state and controls.
 */
export function createConStore<
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
 * @param {DS} initial - The initial {@link Initial state object or `function`} that returns the initial state object
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
export function createConStore<
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
export function createConStore<
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
					state: nextHistory.state,
					...estado,
				};
			},
		},
	);
	const {
		subscribe,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		listeners,
		...estado
	} = estadoSubLis;
	const initialSnapshot = {
		state: estado.get( 'state', ),
		...estado,
	};
	let snapshot = initialSnapshot;
	function useConSelector<Sel extends Selector<S, AR>,>( select?: Sel, ) {
		const selectorCallback = useSelectorCallback<S, AR>(
			sel,
			select,
		);
		const initSnapshotCallback = useCallback(
			() => selectorCallback( initialSnapshot, ),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[],
		);
		const snapshotCallback = useCallback(
			() => selectorCallback( snapshot, ),
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[],
		);

		return useSyncExternalStore(
			subscribe,
			snapshotCallback,
			initSnapshotCallback,
		);
	}

	return Object.assign(
		useConSelector,
		estadoSubLis,
	);
}
