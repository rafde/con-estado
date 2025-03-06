export type GetArrayPathValue<T, K extends Array<string | number>,> = K extends [infer First, ...infer Rest,]
	? First extends keyof T
		? Rest extends [string | number, ...Array<string | number>,]
			? T[First] extends object
				? GetArrayPathValue<T[First], Rest>
				: never
			: T[First]
		: never
	: never;
