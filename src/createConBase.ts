import createConActs from './_internal/createConActs';
import createCon from './_internal/createCon';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Option, } from './types/Option';

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
