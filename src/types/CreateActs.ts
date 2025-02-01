import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { CreateActsProps, } from './CreateActsProps';

export type CreateActs<
	State extends DS,
	Acts extends ActRecord,
> = ( createActsProps: CreateActsProps<State> ) => Acts;
