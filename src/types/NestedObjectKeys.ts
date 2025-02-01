import type { EscapeDots, } from './EscapeDots';
import type { EstadoArray, } from './EstadoArray';
import type { DS, } from './DS';
import type { EstadoRecordKeyTypes, } from './EstadoRecordKeyTypes';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: T[K] extends object
		? `${K}` | `${K}.${NestedObjectKeys<T[K]>}`
		: never;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & ( EstadoRecordKeyTypes )]: T[K] extends object
		? EscapeDots<K> | `${EscapeDots<K>}.${NestedObjectKeys<T[K]>}`
		: never;
}[keyof T & ( EstadoRecordKeyTypes )];

export type NestedObjectKeys<T,> = T extends DS
	? T extends EstadoArray
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
