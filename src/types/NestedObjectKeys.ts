import type { EscapeSpecial, } from './EscapeSpecial';
import type { ADS, DS, } from './DS';
import type { ExtractPlainObject, } from './ExtractPlainObject';
import type { IsPlainObject, } from './IsPlainObject';
import type { IsUnnamedKey, } from './IsUnnamedKey';

type ArrayIndexKey<T,> = {
	[K in keyof T & number]: T[K] extends object ? `[${K}]` | `[${K}]${
			( ExtractPlainObject<T[K]> extends never ? never : `.${NestedObjectKeys<ExtractPlainObject<T[K]>>}` )
			| NestedObjectKeys<Extract<T[K], ADS>>
		}`
		: never;
}[keyof T & number];

type RecordKey<T,> = {
	[K in keyof T & string]: T[K] extends object
		? IsUnnamedKey<T, K> extends true
			? `${EscapeSpecial<K>}${
				( ExtractPlainObject<T[K]> extends never ? never : `.${NestedObjectKeys<ExtractPlainObject<T[K]>>}` )
				| NestedObjectKeys<Extract<T[K], ADS>>
			}`
			: (
					EscapeSpecial<K> | `${EscapeSpecial<K>}${
					( ExtractPlainObject<T[K]> extends never ? never : `.${NestedObjectKeys<ExtractPlainObject<T[K]>>}` )
					| NestedObjectKeys<Extract<T[K], ADS>>
				}`
			)
		: never;
}[keyof T & string];

export type NestedObjectKeys<T,> = T extends DS
	? T extends ADS
		? ArrayIndexKey<T>
		: IsPlainObject<T> extends true
			? RecordKey<T>
			: never
	: never;
