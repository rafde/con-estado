import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { History, } from './History';
import type { Immutable, } from './Immutable';
import type { ConOptions, } from './ConOptions';

export type CreateConOptions<
	S extends DS,
	AR extends ActRecord,
> = ConOptions<S, AR> & {
	dispatcher?: ( history: Immutable<History<S>> ) => void
};
