import type { EscapeSpecial, } from './EscapeSpecial';
import type { ADS, DS, } from './DS';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: `[${K}]` | `[${K}]${IsPlainObject<T[K]> extends true ? `.${NestedRecordKeys<T[K]>}` : NestedRecordKeys<T[K]>}`;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & string]: EscapeSpecial<K> | `${EscapeSpecial<K>}${IsPlainObject<T[K]> extends true ? `.${NestedRecordKeys<T[K]>}` : NestedRecordKeys<T[K]>}`;
}[keyof T & string];

export type NestedRecordKeys<T,> = T extends DS
	? T extends ADS
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
