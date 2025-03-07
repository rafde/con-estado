import type { EscapeSpecial, } from './EscapeSpecial';
import type { ADS, DS, } from './DS';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: T[K] extends object
		? `[${K}]` | `[${K}]${IsPlainObject<T[K]> extends true ? `.${NestedObjectKeys<T[K]>}` : NestedObjectKeys<T[K]>}`
		: never;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & string]: T[K] extends object
		? EscapeSpecial<K> | `${EscapeSpecial<K>}${IsPlainObject<T[K]> extends true ? `.${NestedObjectKeys<T[K]>}` : NestedObjectKeys<T[K]>}`
		: never;
}[keyof T & string];

export type NestedObjectKeys<T,> = T extends DS
	? T extends ADS
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
