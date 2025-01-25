import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { EstadoHistory, } from './EstadoHistory';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { OptionCompare, } from './OptionCompare';
import type { EstadoDS, } from './EstadoDS';

export type Option<
	State extends EstadoDS,
	Acts extends ActRecord,
> = {
	acts?: CreateActs<State, Acts, EstadoHistory<State>>
	compare?: OptionCompare<State>
	afterChange?: OptionAfterChange<State>
};
