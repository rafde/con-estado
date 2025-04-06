import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import isNil from './isNil';

export default function getDeepValueParentByArray<
	S extends object,
	AP extends Array<string | number>,
>(
	state: S | null | undefined,
	arrayPath: AP,
) {
	if ( isNil( state, ) ) {
		return [undefined, undefined,];
	}
	let parent;
	let value = state;
	for ( const key of arrayPath ) {
		const ck = key as keyof typeof parent;
		parent = value;
		value = parent[ ck ];
	}

	return [
		value as GetArrayPathValue<S, AP>,
		parent,
	];
}
