import { strictDeepEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, useSyncExternalStore, } from 'react';
import defaultSelector from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Selector, } from './types/Selector';
import type { UseEstadoProps, } from './types/UseEstadoProps';
import type createConBase from './_internal/createConBase';

/**
 * Type definition for the return value of createConStore.
 * Combines the return type of createConBase with a function signature that accepts an optional selector.
 *
 * @typeParam {DS} State - The type of the state object
 * @typeParam {ActRecord} Acts - The type of the actions record
 */
type CreateConStoreReturnType<
	State extends DS,
	Acts extends ActRecord,
> = ReturnType<typeof createConBase<State, Acts>> & {
	(): ReturnType<typeof defaultSelector<State, Acts>>
	<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>
};

/**
 * Creates a new store with state management and subscription capabilities.
 *
 * @param {DS} initial - The initial state object
 * @param {UseEstadoProps<DS, ActRecord>} [options] - Configuration options
 * @param {CreateActs<DS, ActRecord>} [options.acts] - A function to create a Record of action functions that modify state
 * @param {OptionCompare<DS>} [options.compare] - Custom comparison function to determine if state has changed
 * @param {OptionAfterChange<DS>} [options.afterChange] - Callback function executed asynchronously after state changes
 * @param {Selector<DS, ActRecord>} [options.selector=typeof defaultSelector<DS, ActRecord>] - Function to select and transform state values
 *
 * @returns {CreateConStoreReturnType<DS, ActRecord>} A function that can be used as a hook to access and modify the store state
 *
 * @example
 * ```typescript
 * const useStore = createConStore<StoreState>({
 *   count: 0,
 *   text: ''
 * });
 *
 * // In component:
 * const [state, controls] = useStore();
 * // With selector:
 * const [count, set] = useStore(props => [state.count, controls.set]);
 * ```
 */
export default function createConStore<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: UseEstadoProps<State, Acts>,
): CreateConStoreReturnType<State, Acts> {
	const {
		selector = defaultSelector<State, Acts>,
		..._options
	} = options ?? {};
	const estadoSubLis = createConSubLis(
		initial,
		{
			..._options,
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

	function useConSelector(): ReturnType<typeof defaultSelector<State, Acts>>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select?: Sel, ) {
		const _selector = useMemo(
			() => {
				if ( typeof select === 'function' ) {
					return select;
				}
				return selector;
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[],
		);
		const resultRef = useRef( null as ReturnType<typeof _selector>, );
		const selectorCallback = useCallback(
			( snapshot: typeof initialSnapshot, ) => {
				const result = _selector( snapshot, );
				if ( !strictDeepEqual( resultRef.current, result, ) ) {
					resultRef.current = result as ReturnType<typeof _selector>;
				}
				return resultRef.current;
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[],
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
