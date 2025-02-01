import type { ActRecord, } from './ActRecord';
import type { CreateActsProps, } from './CreateActsProps';
import type { EstadoDS, } from './EstadoDS';

export type EstadoProps<
	State extends EstadoDS,
	Acts extends ActRecord,
> = CreateActsProps<State>
	& {
		acts: Acts
	};
