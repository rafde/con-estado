import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { EstadoProps, } from './EstadoProps';
import type { Selector, } from './Selector';
import type { Immutable, } from './Immutable';

export type DefaultSelector<
	State extends DS,
	Acts extends ActRecord,
> = Selector<
	State,
	Acts,
	[
		Immutable<State>,
		EstadoProps<State, Acts> & Immutable<EstadoHistory<State>>,
	]
>;
