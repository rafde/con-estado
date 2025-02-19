import type { ActRecord, } from './ActRecord';
import type { CreateConSubscribe, } from './CreateConSubscribe';
import type { DS, } from './DS';
import type { Listener, } from './Listener';
import type { SelectorProps, } from './SelectorProps';

export type CreateConSubLisReturn<
	S extends DS,
	AR extends ActRecord,
	Snapshot extends Record<string, unknown>,
> = CreateConSubscribe<S, AR, Snapshot> & {
	listeners: Set<Listener<SelectorProps<S, AR, Snapshot>>>
};
