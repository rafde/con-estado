import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { CreateActsProps, } from './CreateActsProps';

export type CreateActs<
	S extends DS,
	AR extends ActRecord,
> = ( props: CreateActsProps<S> ) => AR;
