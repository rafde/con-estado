import type { ActRecord, } from './ActRecord';
import type { CreateActsProps, } from './CreateActsProps';
import type { DS, } from './DS';

export type CreateConReturnType<
	S extends DS,
	AR extends ActRecord,
> = CreateActsProps<S> & { acts: AR };
