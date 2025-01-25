import type { ActRecord, } from './ActRecord';
import type { EstadoDS, } from './EstadoDS';
import type { EstadoProps, } from './EstadoProps';

export type Selector<
	State extends EstadoDS,
	Acts extends ActRecord,
	R = unknown,
> = ( estadoProps: EstadoProps<State, Acts, void> ) => R;
