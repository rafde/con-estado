import type { ActRecord, } from './ActRecord';
import type { CreateActsProps, } from './CreateActsProps';
import type { DS, } from './DS';

export type EstadoProps<
	State extends DS,
	Acts extends ActRecord,
> = CreateActsProps<State>
	& {
		acts: Acts
	};
