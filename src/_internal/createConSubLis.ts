import type { CreateConOptions, } from '../types/CreateConOptions';
import createCon from './createCon';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Selector, } from '../types/Selector';

export default function createConSubLis<
	S extends DS,
	AR extends ActRecord,
>(
	initial: S,
	options?: CreateConOptions<S, AR>,
) {
	const estado = createCon(
		initial,
		options,
	);
	const listeners = new Set<Selector<S, AR>>();
	function subscribe( listener: Selector<S, AR>, ) {
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
