export type GetArrayPathValue<T, K extends Array<string | number>,> = K extends [infer First, ...infer Rest,]
	? First extends keyof T
		? Rest extends [string | number, ...Array<string | number>,]
			? NonNullable<T[First]> extends object
				? GetArrayPathValue<NonNullable<T[First]>, Rest>
				: never
			: T[First]
		: never
	: never;
