import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { Option, } from './Option';
import type { Selector, } from './Selector';

export type UseEstadoProps<
	State extends DS,
	Acts extends ActRecord,
> = Omit<Option<State, Acts>, 'dispatcher'> & {
	selector?: Selector<State, Acts>
};
