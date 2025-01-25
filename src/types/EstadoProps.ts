import type { ActRecord, } from './ActRecord';
import type { CreateActsProps, } from './CreateActsProps';
import type { EstadoDS, } from './EstadoDS';
import type { EstadoHistory, } from './EstadoHistory';

export type EstadoProps<
	State extends EstadoDS,
	Acts extends ActRecord,
	Return extends EstadoHistory<State> | void,
> = CreateActsProps<State, Return>
	& {
		acts: Acts
	};
