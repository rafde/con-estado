import type { ActRecord, } from './ActRecord';
import type { CreateConReturnType, } from './createConReturnType';
import type { DS, } from './DS';

export type CreateConSubLisReturn<
	S extends DS,
	AR extends ActRecord,
> = CreateConReturnType<S, AR> & {
	subscribe( listener: () => void ): () => void
	listeners: Set<() => void>
};
