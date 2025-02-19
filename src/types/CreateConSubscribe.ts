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
 * Subscribes to state changes in the store. Returns `function` to unsubscribe the listener
 *
 * @typeParam listener - {@link Listener} function that will be called whenever the state changes
 */
	subscribe( listener: Listener<SelectorProps<S, AR, Snapshot>> ): () => void
};
