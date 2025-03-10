import type { ActRecord, } from './ActRecord';
import type { CreateConSubscribe, } from './CreateConSubscribe';
import type { DefaultSelector, } from './DefaultSelector';
import type { DS, } from './DS';
import type { Selector, } from './Selector';
import type { SelectorProps, } from './SelectorProps';

/**
 * Return type for a store creation function that combines state controls with selector functionality.
 *
 * @template S - The state type
 * @template AR - Action record type
 * @template Sel - Selector type extending base Selector
 *
 * @returns {CreateConSubLisReturn<S, AR>} Base store controls and actions
 * @returns {() => ReturnType<Sel>} Default selector when called with no arguments
 * @returns {<Sel>(select: Sel) => ReturnType<Sel>} Custom selector when provided
 *
 * @example
 * ```ts
 * const useStore = createStore<State, Actions>(initialState)
 *
 * // Use default selector
 * const [state, controls] = useStore()
 *```
 *
 * @example
 * ```ts
 * const useStore = createStore<State, Actions>(initialState)
 *
 * // Use custom selector
 * const activeToDonts = useStore(({ state }) =>
 *   state.toDonts.filter(toDont => !toDont.completed)
 * )
 *
 * // Use with multiple derived values
 * const stats = useStore(({ state }) => ({
 *   total: state.toDonts.length,
 *   active: state.toDonts.filter(t => !t.completed).length,
 *   completed: state.toDonts.filter(t => t.completed).length
 * }))
 * ```
 */
export type CreateConStoreReturnType<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
	Sel extends Selector<S, AR, SP> = DefaultSelector<S, AR, SP>,
> = CreateConSubscribe<S, AR, SelectorProps<S, AR, SP>> & {
	(): ReturnType<Sel>
	<Sel extends Selector<S, AR, SP>, >( select: Sel ): ReturnType<Sel>
};
