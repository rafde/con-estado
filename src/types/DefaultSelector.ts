import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { Selector, } from './Selector';

export type DefaultSelector<
	S extends DS,
	AR extends ActRecord,
	P extends Parameters<Selector<S, AR>>[0] = Parameters<Selector<S, AR>>[0],
> = Selector<
	S,
	AR,
	readonly [
		P['state'],
		P,
	]
>;
