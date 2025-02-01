import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { OptionCompare, } from './OptionCompare';
import type { EstadoDS, } from './EstadoDS';

export type Option<
	State extends EstadoDS,
> = {
	compare?: OptionCompare<State>
	afterChange?: OptionAfterChange<State>
	dispatcher?: ( history: Immutable<EstadoHistory<State>> ) => void
};
