import type { ExtractPlainObject, } from './ExtractPlainObject';

export type IsPlainObject<T,> = ExtractPlainObject<NonNullable<T>> extends never
	? false
	: true;
