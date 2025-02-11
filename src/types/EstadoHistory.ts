import type { DS, } from './DS';

export type EstadoHistory<S extends DS,> = {
	changes: ( S extends Array<infer U>
		? Array<U | undefined>
		: S extends Record<string | number, unknown>
			? Partial<S>
			: never
	) | undefined
	initial: S
	priorState: S | undefined
	priorInitial: S | undefined
	state: S
};
