import { useSyncExternalStore, } from 'react';
import type { CreateConReturnType, } from './_internal/createCon';
import defaultSelector, { type DefaultSelector, } from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import useSelectorCallback from './_internal/useSelectorCallback';
import type { ActRecord, } from './types/ActRecord';
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
 * Creates a new store with state management and subscription capabilities.
 *
 * @template {DS} S
 *
 * @param {Initial<S>} initial - The initial state object
 * @param {Option} [options] - Configuration options
 * @param {CreateActs} [options.acts] - A function to create a Record of action functions that modify state
 * @param {OptionCompare} [options.compare] - Custom comparison function to determine if state has changed
 * @param {OptionAfterChange} [options.afterChange] - Callback function executed asynchronously after state changes.
 * Subsequent updates will ignore changes to `function` to prevent excessive re-renders.
 * @param {MutOptions} [options.mutOptions] - Mutative options. {enablePatches: true} not supported
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
	S extends DS,
	AR extends ActRecord,
	Sel extends Selector<S, AR>,
>(
	initial: Initial<S>,
	options: Option<S, AR>,
	selector: Sel
): CreateConStoreReturnType<
	S,
	AR,
	Sel
>;
export default function createConStore<
	S extends DS,
>(
	initial: Initial<S>,
	options?: never,
	selector?: never
): CreateConStoreReturnType<
	S,
	Record<never, never>,
	typeof defaultSelector<S, Record<never, never>>
>;
export default function createConStore<
	S extends DS,
	Sel extends Selector<S, Record<never, never>>,
>(
	initial: Initial<S>,
	selector: Sel,
	_?: never
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
	options?: Option<S, AR>,
	_?: never
): CreateConStoreReturnType<
	S,
	AR,
	typeof defaultSelector<S, AR>
>;
export default function createConStore<
	S extends DS,
	AR extends ActRecord,
>(
	initial: Initial<S>,
	options?: unknown,
	selector?: unknown,
) {
	const _options = options && typeof options === 'object'
		? options as Option<S, AR>
		: {} as Option<S, AR>;
	const _selector = typeof options === 'function'
		? options as Selector<S, AR>
		: typeof selector === 'function'
			? selector as Selector<S, AR>
			: defaultSelector<S, AR>;

	const estadoSubLis = createConSubLis(
		typeof initial === 'function' ? initial() : initial,
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
	function useConSelector<Sel extends Selector<S, AR>,>( select: Sel ): ReturnType<Sel>;
	function useConSelector<Sel extends Selector<S, AR>,>( select?: Sel, ) {
		const selectorCallback = useSelectorCallback<S, AR>(
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
