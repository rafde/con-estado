import type { EstadoArray, } from './EstadoArray';
import type { DS, } from './DS';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayKeys<T,> = {
	[K in keyof T & number]: [K,] | [...[K,], ...NestedKeyArray<T[K]>,]
}[keyof T & number];

type RecordArrayKeys<T,> = {
	[K in keyof T]: [K,] | [...[K,], ...NestedKeyArray<T[K]>,]
}[keyof T];

export type NestedKeyArray<T,> = T extends DS
	? T extends EstadoArray
		? ArrayKeys<T>
		: IsPlainObject<T> extends true
			? RecordArrayKeys<T>
			: never
	: never;
