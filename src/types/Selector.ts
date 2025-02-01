import type { ActRecord, } from './ActRecord';
import type { EstadoDS, } from './EstadoDS';
import type { EstadoHistory, } from './EstadoHistory';
import type { EstadoProps, } from './EstadoProps';
import type { Immutable, } from './Immutable';

export type Selector<
	State extends EstadoDS,
	Acts extends ActRecord,
	R = unknown,
> = ( selectorProps: EstadoProps<State, Acts> & Immutable<EstadoHistory<State>> ) => R;
