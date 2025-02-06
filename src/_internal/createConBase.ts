import createConActs from './createConActs';
import createCon from './createCon';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Option, } from '../types/Option';

export default function createConBase<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Option<State, Acts>,
) {
	const props = createCon( initial, options, );

	return createConActs( props, options?.acts, );
}

export type CreateConBaseReturn<
	State extends DS,
	Acts extends ActRecord,
> = ReturnType<typeof createConActs<State, Acts>>;
