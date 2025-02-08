import { useSyncExternalStore, } from 'react';
import defaultSelector, { type DefaultSelector, } from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import useSelectorCallback from './_internal/useSelectorCallback';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';
import type createConBase from './_internal/createConBase';

/**
 * Type definition for the return value of createConStore.
 * Combines the return type of createConBase with a function signature that accepts an optional selector.
 *
 * @typeParam {DS} S - The type of the state object
 * @typeParam {ActRecord} A - The type of the actions record
 */
type CreateConStoreReturnType<
	State extends DS,
	Acts extends ActRecord,
	Sel extends Selector<State, Acts>,
> = ReturnType<typeof createConBase<State, Acts>> & {
	(): ReturnType<Sel extends Selector<State, Acts> ? Sel : DefaultSelector<State, Acts>>
	<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>
};

/**
 * Creates a new store with state management and subscription capabilities.
 *
 * @param {DS} initial - The initial state object
 * @param {Option} [options] - Configuration options
 * @param {CreateActs} [options.acts] - A function to create a Record of action functions that modify state
 * @param {OptionCompare} [options.compare] - Custom comparison function to determine if state has changed
 * @param {OptionAfterChange} [options.afterChange] - Callback function executed asynchronously after state changes.
 * Subsequent updates will ignore changes to `function` to prevent excessive re-renders.
 * @param {MutOptions} [options.mutOptions={strict: true}] - Mutative options. {enablePatches: true} not supported
 * @param {Selector} [selector=typeof defaultSelector] - Function to select and transform state values
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
	Sel extends Selector<State, Acts>,
>(
	initial: State,
	options: Option<State, Acts>,
	selector: Sel
): CreateConStoreReturnType<
	State,
	Acts,
	Sel
>;
export default function createConStore<
	State extends DS,
>(
	initial: State,
	options?: never,
	selector?: never
): CreateConStoreReturnType<
	State,
	Record<never, never>,
	typeof defaultSelector<State, Record<never, never>>
>;
export default function createConStore<
	State extends DS,
	Sel extends Selector<State, Record<never, never>>,
>(
	initial: State,
	selector: Sel,
	_?: never
): CreateConStoreReturnType<
	State,
	Record<never, never>,
	Sel
>;
export default function createConStore<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Option<State, Acts>,
	_?: never
): CreateConStoreReturnType<
	State,
	Acts,
	typeof defaultSelector<State, Acts>
>;
export default function createConStore<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: unknown,
	selector?: unknown,
) {
	const _options = options && typeof options === 'object'
		? options as Option<State, Acts>
		: {} as Option<State, Acts>;
	const _selector = typeof options === 'function'
		? options as Selector<State, Acts>
		: typeof selector === 'function'
			? selector as Selector<State, Acts>
			: defaultSelector<State, Acts>;

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
	function useConSelector(): ReturnType<typeof _selector>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select?: Sel, ) {
		const selectorCallback = useSelectorCallback<State, Acts>(
			_selector,
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
