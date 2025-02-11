import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';

export default function createHistory<
	S extends DS,
>( history: Omit<Partial<EstadoHistory<S>>, 'initial'> & { initial: S }, ): EstadoHistory<S> {
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
