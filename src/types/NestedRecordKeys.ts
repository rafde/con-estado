import type { EscapeSpecial, } from './EscapeSpecial';
import type { DS, } from './DS';
import type { ExcludePlainObject, } from './ExcludePlainObject';
import type { ExtractPlainObject, } from './ExtractPlainObject';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: `[${K}]` | `[${K}]${
	( ExtractPlainObject<T[K]> extends never ? never : `.${NestedRecordKeys<ExtractPlainObject<T[K]>>}` )
	| NestedRecordKeys<ExcludePlainObject<T[K]>>
	}`;
}[keyof T & number];

type IsUnnamedKey<T, K extends keyof T,> = string extends K ? true : false;

type RecordKey<T,> = {
	[K in keyof T & string]: IsUnnamedKey<T, K> extends true
		? `${EscapeSpecial<K>}${
			( ExtractPlainObject<T[K]> extends never ? never : `.${NestedRecordKeys<ExtractPlainObject<T[K]>>}` )
			| NestedRecordKeys<ExcludePlainObject<T[K]>>
		}`
		: (
				EscapeSpecial<K> | `${EscapeSpecial<K>}${
				( ExtractPlainObject<T[K]> extends never ? never : `.${NestedRecordKeys<ExtractPlainObject<T[K]>>}` )
				| NestedRecordKeys<ExcludePlainObject<T[K]>>
			}`
		)
	;
}[keyof T & string];

export type NestedRecordKeys<T,> = T extends DS
	? ArrayIndexKey<T> | RecordKey<T>
	: never;
