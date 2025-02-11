import type { DS, } from './DS';

export type EstadoHistory<State extends DS,> = {
	changes: ( State extends Array<infer U>
		? Array<U | undefined>
		: State extends Record<string | number, unknown>
			? Partial<State>
			: never
	) | undefined
	initial: State
	priorState: State | undefined
	priorInitial: State | undefined
	state: State
};
