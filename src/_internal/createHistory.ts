import type { EstadoDS, } from '../types/EstadoDS';
import type { EstadoHistory, } from '../types/EstadoHistory';

export default function createHistory<
	State extends EstadoDS,
>( history: Omit<Partial<EstadoHistory<State>>, 'initial'> & { initial: State }, ): EstadoHistory<State> {
	const {
		changes = undefined,
		initial,
		state = initial,
		priorState = undefined,
		priorInitial = undefined,
	} = history;
	return {
		changes,
		initial,
		priorState,
		priorInitial,
		state,
	};
}
