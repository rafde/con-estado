import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { Option, } from './Option';

export type UseEstadoProps<
	State extends DS,
	Acts extends ActRecord,
> = Omit<Option<State, Acts>, 'dispatcher'>;
