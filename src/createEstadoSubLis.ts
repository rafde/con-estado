import createConBase from './createConBase';
import type { ActRecord, } from './types/ActRecord';
import type { EstadoDS, } from './types/EstadoDS';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';

export default function createEstadoSubLis<
	State extends EstadoDS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Option<State, Acts>,
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
