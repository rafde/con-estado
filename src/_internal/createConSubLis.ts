import type { CreateConOptions, } from '../types/CreateConOptions';
import createConBase from './createConBase';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Selector, } from '../types/Selector';

export default function createConSubLis<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: CreateConOptions<State, Acts>,
) {
	const estado = createConBase(
		initial,
		options,
	);
	const listeners = new Set<Selector<State, Acts>>();
	function subscribe( listener: Selector<State, Acts>, ) {
		listeners.add( listener, );
		return () => {
			listeners.delete( listener, );
		};
	}

	return {
		...estado,
		subscribe,
		listeners,
	};
}
