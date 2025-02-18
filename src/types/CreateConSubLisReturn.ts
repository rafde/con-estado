import type { ActRecord, } from './ActRecord';
import type { CreateConReturnType, } from './CreateConReturnType';
import type { DS, } from './DS';
import type { SelectorProps, } from './SelectorProps';

type Listener<Snapshot,> = ( props: Snapshot ) => void;

export type CreateConSubLisReturn<
	S extends DS,
	AR extends ActRecord,
	Snapshot = SelectorProps<S, AR>,
> = CreateConReturnType<S, AR> & {
	subscribe( listener: Listener<Snapshot> ): () => void
	listeners: Set<Listener<Snapshot>>
};
