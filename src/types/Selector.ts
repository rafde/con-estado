import type { CreateConBaseReturn, } from '../_internal/createConBase';
import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';

export type Selector<
	State extends DS,
	Acts extends ActRecord,
	R = unknown,
> = ( selectorProps: CreateConBaseReturn<State, Acts> & Immutable<EstadoHistory<State>> ) => R;
