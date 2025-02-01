import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';

export type OptionAfterChange<
	State extends DS,
> = (
	estadoHistory: Immutable<EstadoHistory<State>>,
) => Promise<void> | void;
