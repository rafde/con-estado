import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { EstadoProps, } from './EstadoProps';
import type { Immutable, } from './Immutable';

export type Selector<
	State extends DS,
	Acts extends ActRecord,
	R = unknown,
> = ( selectorProps: EstadoProps<State, Acts> & Immutable<EstadoHistory<State>> ) => R;
