import type { EstadoDS, } from './EstadoDS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';

export type OptionAfterChange<
	State extends EstadoDS,
> = (
	estadoHistory: Immutable<EstadoHistory<State>>,
) => Promise<void> | void;
