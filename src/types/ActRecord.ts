export type ActRecord = Record<
	string | number | symbol,
	( ...args: never[] ) => unknown
>;
