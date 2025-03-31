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
 * Creates a global state store with history tracking and subscription capabilities using React's useSyncExternalStore.
 * Provides a centralized solution for state management that persists across component unmounts.
 *
 * @template S - The data structure type extending DS (must be a plain object or array)
 * @template AR - Action Record type defining custom action handlers
 * @template SP - Additional selector props type
 * @template Sel - Selector type with default being DefaultSelector
 *
 * @param {Initial<DS>} initial - Initial state value or factory function
 * @param {ConOptions<DS, ActRecord>} [options] - Configuration options for the store
 * @param {Selector<DS, ActRecord, Record<string, unknown>>} [selector] - Optional selector function to customize hook return value
 *
 * @returns A React hook function with attached static control methods
 *
 * @example Basic Usage
 * ```tsx
 * // Create store
 * const useStore = createConStore({
 *   user: { name: '', age: 0 },
 *   settings: { theme: 'light' }
 * });
 *
 * // Use in component
 * function UserProfile() {
 *   const [state, { set }] = useStore();
 *
 *   return (
 *     <input
 *       value={state.user.name}
 *       onChange={e => set('state.user.name', e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @example With Custom Actions
 * ```tsx
 * const useStore = createConStore(
 *   { count: 0 },
 *   {
 *     acts: ({ commit }) => ({
 *       increment: () => commit(({ state }) => { state.count++ }),
 *       incrementBy: (amount: number) =>
 *         commit(({ state }) => { state.count += amount }),
 *       async asyncIncrement() {
 *         await someAsyncOperation();
 *         commit(({ state }) => { state.count++ });
 *       }
 *     })
 *   }
 * );
 * ```
 *
 * @example With Custom Selector
 * ```tsx
 * const useStore = createConStore(
 *   { count: 0, text: '' },
 *   {
 *     acts: ({ set }) => ({
 *       setText: (text: string) => set('state.text', text)
 *     })
 *   },
 *   ({ state, acts }) => ({
 *     count: state.count,
 *     text: state.text,
 *     setText: acts.setText
 *   })
 * );
 *
 * // Use in component
 * function Component() {
 *   const { count, text, setText } = useStore();
 *   return <input value={text} onChange={e => setText(e.target.value)} />;
 * }
 * ```
 *
 * @example With beforeChange and afterChange
 * ```tsx
 * const useStore = createConStore(
 *   { count: 0 },
 *   {
 *     beforeChange: ({ historyDraft }) => {
 *       // Validate or modify state before changes are applied
 *       if (historyDraft.state.count < 0) {
 *         historyDraft.state.count = 0;
 *       }
 *     },
 *     afterChange: async ({ state }) => {
 *       localStorage.setItem('appState', JSON.stringify(state));
 *     }
 *   }
 * );
 * ```
 *
 * @example Using Static Methods
 * ```tsx
 * // Access store methods without hooks
 * const { get, set, commit } = useStore;
 *
 * // Use in event handlers or services
 * function handleGlobalEvent(data: any) {
 *   set('state.lastEvent', data);
 * }
 *
 * // Get current state
 * const currentState = get();
 * ```
 *
 * @remarks
 * - Store persists across component unmounts
 * - Supports both synchronous and asynchronous actions
 * - Provides optimized updates using React's useSyncExternalStore
 * - Maintains full type safety across all operations
 * - Includes history tracking for state changes
 * - Supports middleware through afterChange option
 * - Static methods available for non-component usage
 * - Compatible with React's concurrent features
 *
 * @throws {Error} When initial state is not a plain object or array
 *
 * @see {@link ConOptions} For detailed options configuration
 * @see {@link Selector} For selector customization
 * @see {@link ActRecord} For action handlers type
 * @see {@link History} For state history structure
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
