import type { CreateConOptions, } from '../types/CreateConOptions';
import createCon from './createCon';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';

export default function createConBase<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: CreateConOptions<State, Acts>,
) {
	return createCon( initial, options, );
}

export type CreateConBaseReturn<
	State extends DS,
	Acts extends ActRecord,
> = ReturnType<typeof createConBase<State, Acts>>;
