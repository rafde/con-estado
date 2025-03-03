import { useCallback, useSyncExternalStore, } from 'react';
import isFunc from './_internal/isFunc';
import type { CreateConStoreReturnType, } from './types/CreateConStoreReturnType';
import defaultSelector from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import getSnapshotSymbol from './_internal/getSnapshotSymbol';
import isPlainObj from './_internal/isPlainObj';
import useSelCb from './_internal/useSelCb';
import type { ActRecord, } from './types/ActRecord';
import type { DefaultSelector, } from './types/DefaultSelector';
import type { DS, } from './types/DS';
import type { GetSnapshot, } from './types/GetSnapshot';
import type { History, } from './types/History';
import type { Immutable, } from './types/Immutable';
import type { Initial, } from './types/Initial';
import type { ConOptions, } from './types/ConOptions';
import type { Selector, } from './types/Selector';
import type { SelectorProps, } from './types/SelectorProps';

export type CreateConStoreOptions<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
> = ConOptions<S, AR> & {
	[getSnapshotSymbol]?: ( props: SelectorProps<S, AR> ) => SelectorProps<S, AR, SP>
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
 * @param {DS} initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param {ConOptions} [options] - Configuration {@link ConOptions options}.
 *
 * @param {ConOptions.acts} [options.acts] - A {@link ConOptions.acts function} that creates reusable actions for state management.
 * Takes control props (set, get, reset, etc.) and returns an object of action functions that can be asynchronous.
 *
 * @param {ConOptions.afterChange} [options.afterChange] - A {@link ConOptions.afterChange function} that runs after state changes are dispatched.
 * Receives the immutable history object containing the current state, changes, and previous states.
 * Can be async and return a Promise or void.
 *
 * @param {ConMutOptions} [options.mutOptions] - Configuration {@link ConMutOptions options} for the Mutative library's state updates.
 * Controls how drafts are created and modified. Supports all Mutative options except `enablePatches`.
 * See {@link https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options Mutative Options}
 *
 * @param {ConOptions.transform} [options.transform] - A {@link ConOptions.transform function} to transform state before it's updated.
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
	SP extends Record<string, unknown>,
	Sel extends Selector<S, AR, SP> = DefaultSelector<S, AR, SP>,
>(
	initial: Initial<S>,
	options?: CreateConStoreOptions<S, AR, SP>,
	selector?: Sel
): CreateConStoreReturnType<
	S,
	AR,
	SP,
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
	SP extends Record<string, unknown>,
	Sel extends Selector<S, Record<never, never>, SP>,
>(
	initial: Initial<S>,
	selector: Sel,
): CreateConStoreReturnType<
	S,
	Record<never, never>,
	SP,
	Sel
>;
export function createConStore<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
	Sel extends Selector<S, AR, SP> = DefaultSelector<S, AR, SP>,
>(
	initial: Initial<S>,
	options?: CreateConStoreOptions<S, AR, SP> | Sel,
	selector?: Sel,
) {
	const [
		opts,
		sel,
	] = isPlainObj( options, )
		? [options as CreateConStoreOptions<S, AR, SP>, ( selector ?? defaultSelector<S, AR, SP> ) as Selector<S, AR, SP>,]
		: [{} as CreateConStoreOptions<S, AR, SP>, ( options ?? defaultSelector<S, AR, SP> ) as Selector<S, AR, SP>,];

	const {
		[ getSnapshotSymbol ]: _getSnapshot,
	} = opts;

	const getSnapshot = ( nextHistory: Immutable<History<S>>, ) => {
		const _snapshot = {
			state: nextHistory.state,
			...estado,
		};
		snapshot = isFunc( _getSnapshot, ) ? _getSnapshot( _snapshot, ) : _snapshot as unknown as SelectorProps<S, AR, SP>;
		return snapshot;
	};
	let snapshot: ReturnType<GetSnapshot<S, AR, SP>>;
	const estadoSubLis = createConSubLis<S, AR, SP>(
		isFunc( initial, ) ? initial() : initial,
		getSnapshot as GetSnapshot<S, AR, SP>,
		opts,
	);
	const {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		listeners,
		...estado
	} = estadoSubLis;

	const initialSnapshot = getSnapshot( estado.get(), );

	function useConSelector<Sel extends Selector<S, AR, SP>,>( select?: Sel, ) {
		const selectorCallback = useSelCb<S, AR, SP>(
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
			estado.subscribe,
			snapshotCallback,
			initSnapshotCallback,
		);
	}

	return Object.assign(
		useConSelector,
		estado,
	);
}
