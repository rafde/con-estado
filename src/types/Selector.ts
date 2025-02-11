import type { CreateConReturnType, } from '../_internal/createCon';
import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';

export type Selector<
	S extends DS,
	AR extends ActRecord | Record<never, never>,
	R = unknown,
> = ( selectorProps: CreateConReturnType<S, AR> & Immutable<EstadoHistory<S>> ) => R;
