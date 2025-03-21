import type { ExtractPlainObject, } from './ExtractPlainObject';

export type IsUnnamedKey<T, K extends keyof T, > = ExtractPlainObject<T> extends never
	? false
	: string extends K ? true : false;
