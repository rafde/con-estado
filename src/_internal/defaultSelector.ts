import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';

import type { Immutable, } from '../types/Immutable';
import type { Selector, } from '../types/Selector';

export default function defaultSelector<
	S extends DS,
	AR extends ActRecord,
>( selectorProps: Parameters<Selector<S, AR>>[0], ): readonly [
	Immutable<S>,
	Parameters<Selector<S, AR>>[0],
] {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}

export type DefaultSelector<
	S extends DS,
	AR extends ActRecord,
> = typeof defaultSelector<S, AR>;
