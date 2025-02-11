import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';
import type { Option, } from './Option';

export type CreateConOptions<
	S extends DS,
	AR extends ActRecord,
> = Option<S, AR> & {
	dispatcher?: ( history: Immutable<EstadoHistory<S>> ) => void
};
