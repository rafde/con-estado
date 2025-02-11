import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { Immutable, } from './Immutable';

export type OptionAfterChange<
	S extends DS,
> = (
	estadoHistory: Immutable<EstadoHistory<S>>,
) => Promise<void> | void;
