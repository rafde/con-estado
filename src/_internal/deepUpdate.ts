import isArray from './isArray';
import isNil from './isNil';
import isObj from './isObj';
import isPlainObj from './isPlainObj';
import isStr from './isStr';
import objectIs from './objectIs';
import { reflectGet, reflectSet, } from './reflect';

function getIndex( path: unknown, currentTarget: Array<unknown>, ) {
	const isNum = typeof path === 'number';

	if ( !isNum || !Number.isInteger( path, ) ) {
		return;
	}

	if ( path < 0 ) {
		return currentTarget.length + path;
	}

	return path;
}

function getKey( path: unknown, currentTarget: unknown, ) {
	if ( isArray( currentTarget, ) ) {
		return getIndex( path, currentTarget, );
	}

	if ( !isPlainObj( currentTarget, ) || !isStr( path, ) ) {
		return;
	}

	return path;
}

export default function deepUpdate<T extends object,>( target: T, arrayPath: Array<string | number>, value: ( oldValue: unknown ) => unknown, ) {
	const arrayPathLength = arrayPath.length;
	const lastIndex = arrayPathLength - 1;
	let currentTarget: unknown = target;
	const pathArr: Array<string | number> = [];

	for (
		let i = 0, path = arrayPath[ i ];
		i < arrayPathLength;
		path = arrayPath[ ++i ]
	) {
		if ( !isObj( currentTarget, ) ) {
			pathArr.push( path, );
			throw new Error( `${pathArr.map( String, ).join( '.', )} is invalid target type of ${typeof currentTarget}. Must be array or object`, );
		}

		const key = getKey( path, currentTarget, );
		if ( isNil( key, ) ) {
			pathArr.push( path, );
			throw new Error( `Invalid target key: ${pathArr.map( String, ).join( '.', )} of type ${typeof key}`, );
		}

		if ( typeof key === 'number' && key < 0 ) {
			pathArr.push( key, );
			throw new Error( `Array index for ${pathArr.map( String, ).join( '.', )} was out of bounds for array length ${( currentTarget as Array<unknown> )?.length}`, );
		}

		if ( i === lastIndex ) {
			const oldValue = reflectGet( currentTarget, key, );
			const newValue = value( oldValue, );
			if ( objectIs( oldValue, newValue, ) ) {
				return;
			}
			reflectSet(
				currentTarget,
				key,
				newValue,
			);
			return;
		}

		pathArr.push( path, );
		// how to handle undefined??
		if ( Object.hasOwn( currentTarget, key, ) ) {
			currentTarget = reflectGet( currentTarget, key, );
			continue;
		}

		const currentValue = typeof arrayPath[ i + 1 ] === 'number' ? [] : {};

		reflectSet(
			currentTarget,
			key,
			currentValue,
		);

		currentTarget = currentValue;
	}
}
