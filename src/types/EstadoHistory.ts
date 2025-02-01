import type { DS, } from './DS';
import type { EstadoRecord, } from './EstadoRecord';

export type EstadoHistory<State extends DS,> = {
	changes: ( State extends Array<infer U>
		? Array<U | undefined>
		: State extends EstadoRecord
			? Partial<State>
			: never
	) | undefined
	initial: State
	priorState: State | undefined
	priorInitial: State | undefined
	state: State
};
