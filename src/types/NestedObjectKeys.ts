import type { EscapeDots, } from './EscapeDots';
import type { DS, } from './DS';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: T[K] extends object
		? `${K}` | `${K}.${NestedObjectKeys<T[K]>}`
		: never;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & ( string | number )]: T[K] extends object
		? EscapeDots<K> | `${EscapeDots<K>}.${NestedObjectKeys<T[K]>}`
		: never;
}[keyof T & ( string | number )];

export type NestedObjectKeys<T,> = T extends DS
	? T extends Array<unknown>
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
