import type { ActRecord, } from './ActRecord';
import type { CreateConReturnType, } from './CreateConReturnType';
import type { DS, } from './DS';
import type { Immutable, } from './Immutable';

export type SelectorProps<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown> = Record<never, never>,
> = CreateConReturnType<S, AR> & Immutable<{ state: S }> & SP;
