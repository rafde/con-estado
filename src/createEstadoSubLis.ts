import createEstado from './createEstado';
import type { ActRecord, } from './types/ActRecord';
import type { CreateActs, } from './types/CreateActs';
import type { EstadoDS, } from './types/EstadoDS';
import type { EstadoHistory, } from './types/EstadoHistory';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';

export default function createEstadoSubLis<
	State extends EstadoDS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Option<State> | CreateActs<State, Acts, EstadoHistory<State>>,
	createActs?: CreateActs<State, Acts, EstadoHistory<State>>,
) {
	const estado = createEstado(
		initial,
		options,
		createActs,
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
