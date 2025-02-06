import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { Immutable, } from '../types/Immutable';
import type { Selector, } from '../types/Selector';
import type { CreateConBaseReturn, } from './createConBase';

export default function defaultSelector<
	State extends DS,
	Acts extends ActRecord,
>( selectorProps: Parameters<Selector<State, Acts>>[0], ): readonly [
	Immutable<State>,
	CreateConBaseReturn<State, Acts> & Immutable<EstadoHistory<State>>,
] {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}
