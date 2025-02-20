import type { ActRecord, } from './ActRecord';
import type { CreateConReturnType, } from './CreateConReturnType';
import type { DS, } from './DS';
import type { Listener, } from './Listener';
import type { SelectorProps, } from './SelectorProps';

export type CreateConSubscribe<
	S extends DS,
	AR extends ActRecord,
	Snapshot extends Record<string, unknown>,
> = CreateConReturnType<S, AR> & {
/**
 * Subscribes to state changes in the store.
 *
 * @typeParam {Listener} listener - {@link Listener} function that will be called whenever the state changes
 * @returns An unsubscribe listener `function`.
 *
 * @example
 * ```ts
 * const [
 * 	state,
 * 	{ subscribe }
 * ] = useCon( { count: 0 }, );
 *
 * const {
 * 	subscribe
 * } = useConSelector(( { subscribe } ) => ( { subscribe } ));
 *
 * // Subscribe to state changes
 * const unsubscribe = subscribe({{ state }} => {
 *   if (state.count > 100) {
 *     console.log('Why is the count so high?');
 *     notifyCountReached(state.count);
 *   }
 * });
 *
 * // Later, when you want to stop listening
 * unsubscribe();
 * ```
 */
	subscribe( listener: Listener<SelectorProps<S, AR, Snapshot>> ): () => void
};
