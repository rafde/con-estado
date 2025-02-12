export type ActRecord = Record<
	string | number,
	( ...args: never[] ) => unknown
> | Record<never, never>;
