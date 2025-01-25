import type { ActRecord, } from './ActRecord';
import type { EstadoDS, } from './EstadoDS';
import type { EstadoProps, } from './EstadoProps';
import type { Selector, } from './Selector';
import type { Immutable, } from './Immutable';

export type DefaultSelector<
	State extends EstadoDS,
	Acts extends ActRecord,
> = Selector<
	State,
	Acts,
	Immutable<[
		State,
		EstadoProps<State, Acts, void>,
	]>
>;
