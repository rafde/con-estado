import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Selector, } from '../types/Selector';

export default function defaultSelector<
	State extends DS,
	Acts extends ActRecord,
>( selectorProps: Parameters<Selector<State, Acts>>[0], ) {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}
