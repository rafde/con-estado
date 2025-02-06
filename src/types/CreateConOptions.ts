import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';
import type { Option, } from './Option';

export type CreateConOptions<
	State extends DS,
	Acts extends ActRecord,
> = Option<State, Acts> & {
	dispatcher?: ( history: Immutable<EstadoHistory<State>> ) => void
};
