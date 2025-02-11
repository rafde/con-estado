import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { StringPathToArray, } from '../types/StringPathToArray';
import isPlainObject from './isPlainObject';

export default function getDeepValueParentByArray<
	S extends object,
	AP extends StringPathToArray<NestedRecordKeys<S>> | Array<string | number>,
>(
	state: S | null | undefined,
	arrayPath: AP,
) {
	if ( state == null ) {
		return [undefined, undefined,];
	}
	let parent;
	let value = state;
	for ( const key of arrayPath ) {
		const isObj = isPlainObject( value, );
		const isArray = Array.isArray( value, );
		if ( isObj && isArray ) {
			break;
		}
		const ck = key as keyof typeof parent;
		parent = value;
		value = parent[ ck ];
	}

	return [
		value as GetArrayPathValue<S, AP>,
		parent,
	];
}
