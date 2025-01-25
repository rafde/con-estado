import type { EscapeDots, } from './EscapeDots';
import type { EstadoArray, } from './EstadoArray';
import type { EstadoDS, } from './EstadoDS';
import type { EstadoRecordKeyTypes, } from './EstadoRecordKeyTypes';
import type { IsPlainObject, } from './IsPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: `${K}` | `${K}.${NestedRecordKeys<T[K]>}`;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & ( EstadoRecordKeyTypes )]: EscapeDots<K> | `${EscapeDots<K>}.${NestedRecordKeys<T[K]>}`;
}[keyof T & ( EstadoRecordKeyTypes )];

export type NestedRecordKeys<T,> = T extends EstadoDS
	? T extends EstadoArray
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
