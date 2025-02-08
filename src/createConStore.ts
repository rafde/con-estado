import { useSyncExternalStore, } from 'react';
import defaultSelector from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import useSelectorCallback from './_internal/useSelectorCallback';
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
	Options extends UseEstadoProps<State, Acts>,
> = ReturnType<typeof createConBase<State, Acts>> & {
	(): Options extends undefined
		? ReturnType<typeof defaultSelector<State, Acts>>
		: Options['selector'] extends Selector<State, Acts>
			? ReturnType<Options['selector']>
			: ReturnType<typeof defaultSelector<State, Acts>>
	<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>
};

/**
 * Creates a new store with state management and subscription capabilities.
 *
 * @param {DS} initial - The initial state object
 * @param {UseEstadoProps} [options] - Configuration options
 * @param {CreateActs} [options.acts] - A function to create a Record of action functions that modify state
 * @param {OptionCompare} [options.compare] - Custom comparison function to determine if state has changed
 * @param {OptionAfterChange} [options.afterChange] - Callback function executed asynchronously after state changes
 * @param {Selector} [options.selector=typeof defaultSelector<DS>] - Function to select and transform state values.
 * Subsequent updates will ignore changes to `function` to prevent excessive re-renders.
 * @param {MutOptions} [options.mutOptions={strict: true}] - Mutative options. {enablePatches: true} not supported
 *
 * @returns {CreateConStoreReturnType<DS, ActRecord>} A function that can be used as a hook to access and modify the store state
 *
 * @example
 * ```typescript
 * const useStore = createConStore<StoreState>({
 *    user: {
 *      count: 0,
 *      text: ''
 *    }
 * });
 *
 * // In component:
 * const [state, controls] = useStore();
 * controls.set( 'user.text', 'hi');
 *
 * // With selector:
 * const [count, set] = useStore({state, set} => [state.user.count, set]);
 * set( 'user.text', 'hi');
 * ```
 */
export default function createConStore<
	State extends DS,
	Acts extends ActRecord,
	Options extends UseEstadoProps<State, Acts>,
>(
	initial: State,
	options?: Options,
): CreateConStoreReturnType<State, Acts, Options> {
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

	function useConSelector(): ReturnType<
		Options extends undefined
			? typeof defaultSelector<State, Acts>
			: Options['selector'] extends Selector<State, Acts>
				? Options['selector']
				: typeof defaultSelector<State, Acts>
	>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select?: Sel, ) {
		const selectorCallback = useSelectorCallback(
			selector,
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
	) as CreateConStoreReturnType<State, Acts, Options>;
}
