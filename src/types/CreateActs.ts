import type { ActRecord, } from './ActRecord';
import type { EstadoDS, } from './EstadoDS';
import type { EstadoHistory, } from './EstadoHistory';
import type { CreateActsProps, } from './CreateActsProps';

export type CreateActs<
	State extends EstadoDS,
	Acts extends ActRecord,
	Return extends EstadoHistory<State> | void,
> = ( createActsProps: CreateActsProps<State, Return> ) => Acts;
