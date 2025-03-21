import type { ADS, DS, } from './DS';
import type { EscapeSpecial, } from './EscapeSpecial';
import type { ExtractPlainObject, } from './ExtractPlainObject';
import type { IsPlainObject, } from './IsPlainObject';
import type { IsUnnamedKey, } from './IsUnnamedKey';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: `[${K}]` | `[${K}]${
	( ExtractPlainObject<T[K]> extends never ? never : `.${NestedRecordKeys<ExtractPlainObject<T[K]>>}` )
	| NestedRecordKeys<Extract<T[K], ADS>>
	}`;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & string]: IsUnnamedKey<T, K> extends true
		? `${EscapeSpecial<K>}${
			( ExtractPlainObject<T[K]> extends never ? never : `.${NestedRecordKeys<ExtractPlainObject<T[K]>>}` )
			| NestedRecordKeys<Extract<T[K], ADS>>
		}`
		: (
				EscapeSpecial<K> | `${EscapeSpecial<K>}${
				( ExtractPlainObject<T[K]> extends never ? never : `.${NestedRecordKeys<ExtractPlainObject<T[K]>>}` )
				| NestedRecordKeys<Extract<T[K], ADS>>
			}`
		)
	;
}[keyof T & string];

export type NestedRecordKeys<T,> = T extends DS
	? T extends ADS
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
