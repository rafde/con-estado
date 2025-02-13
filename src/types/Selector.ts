import type { CreateConReturnType, } from '../_internal/createCon';
import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { Immutable, } from './Immutable';

export type Selector<
	S extends DS,
	AR extends ActRecord,
	R = unknown,
> = ( selectorProps: CreateConReturnType<S, AR> & Immutable<{ state: S }> ) => R;
