import type { ExtractPlainObject, } from './ExtractPlainObject';

type GetObjValue<O, K extends keyof O, R,> = O[K] extends object
	? R extends [string | number, ...Array<string | number>,]
		? GetArrayPathValue<O[K], R>
		: O[K]
	: R extends Array<string | number>
		? GetArrayPathValue<O[K], R>
		: never;

export type GetArrayPathValue<T, K extends Array<string | number>,> = K extends [infer First, ...infer Rest,]
	? First extends keyof T
		? GetObjValue<T, First, Rest>
		: First extends number
			? T extends Array<infer U>
				? Rest extends [string | number, ...Array<string | number>,]
					? GetArrayPathValue<U, Rest>
					: NonNullable<U>
				: never
			: ExtractPlainObject<T> extends infer O
				? First extends keyof O
					? GetObjValue<O, First, Rest>
					: never
				: never
	: T;
