import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { OptionCompare, } from './OptionCompare';
import type { EstadoDS, } from './EstadoDS';

export type Option<
	State extends EstadoDS,
	Acts extends ActRecord,
> = {
	compare?: OptionCompare<State>
	afterChange?: OptionAfterChange<State>
	dispatcher?: ( history: Immutable<EstadoHistory<State>> ) => void
	acts?: CreateActs<State, Acts>
};
