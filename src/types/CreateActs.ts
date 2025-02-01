import type { ActRecord, } from './ActRecord';
import type { EstadoDS, } from './EstadoDS';
import type { CreateActsProps, } from './CreateActsProps';

export type CreateActs<
	State extends EstadoDS,
	Acts extends ActRecord,
> = ( createActsProps: CreateActsProps<State> ) => Acts;
