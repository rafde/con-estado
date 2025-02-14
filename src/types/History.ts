import type { DS, RDS, } from './DS';

export type History<S extends DS,> = {
	changes?: ( S extends Array<infer U>
		? Array<U | undefined>
		: S extends RDS
			? Partial<S>
			: never
	)
	initial: S
	prev?: S
	prevInitial?: S
	state: S
};
