import type { EscapeDots, } from './EscapeDots';
import type { DS, } from './DS';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: `${K}` | `${K}.${NestedRecordKeys<T[K]>}`;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & ( string | number )]: EscapeDots<K> | `${EscapeDots<K>}.${NestedRecordKeys<T[K]>}`;
}[keyof T & ( string | number )];

export type NestedRecordKeys<T,> = T extends DS
	? T extends Array<unknown>
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
