import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';

import type { Immutable, } from '../types/Immutable';
import type { Selector, } from '../types/Selector';

export default function defaultSelector<
	State extends DS,
	Acts extends ActRecord,
>( selectorProps: Parameters<Selector<State, Acts>>[0], ): readonly [
	Immutable<State>,
	Parameters<Selector<State, Acts>>[0],
] {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}

export type DefaultSelector<
	State extends DS,
	Acts extends ActRecord,
> = typeof defaultSelector<State, Acts>;
