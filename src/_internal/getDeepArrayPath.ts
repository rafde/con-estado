import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { StringPathToArray, } from '../types/StringPathToArray';
import isPlainObject from './isPlainObject';

export default function getDeepArrayPath<
	State extends object,
	ArrayPath extends StringPathToArray<NestedRecordKeys<State>> | Array<string | number>,
	CleanKey extends ( ( key: string | number ) => string | number ) = ( key: string | number ) => string | number,
>(
	state: State | null | undefined,
	arrayPath: ArrayPath,
	cleanKey?: CleanKey,
) {
	if ( state == null ) {
		return [undefined, undefined,];
	}
	const _cleanKey = typeof cleanKey === 'function' ? cleanKey : ( key: string | number, ) => key;
	let parent;
	let value = state;
	for ( const key of arrayPath ) {
		const isObj = isPlainObject( value, );
		const isArray = Array.isArray( value, );
		if ( isObj && isArray ) {
			break;
		}
		const ck = _cleanKey( key, ) as keyof typeof parent;
		parent = value;
		value = parent[ ck ];
	}

	return [
		value as GetArrayPathValue<State, ArrayPath>,
		parent,
	];
}
