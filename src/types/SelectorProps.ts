import type { ActRecord, } from './ActRecord';
import type { CreateConSubscribe, } from './CreateConSubscribe';
import type { DS, } from './DS';
import type { Immutable, } from './Immutable';

export type SelectorProps<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown> = Record<never, never>,
> = CreateConSubscribe<S, AR, SP> & Immutable<{ state: S }> & SP;
