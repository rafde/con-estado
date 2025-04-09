import isNil from './isNil';
import isObj from './isObj';
import isArray from './isArray';
import objectIs from './objectIs';
import { reflectGet, reflectSet, } from './reflect';

function getKey( path: unknown, currentTarget: unknown, ): string | number | undefined {
	if ( isArray( currentTarget, ) ) {
		const isNum = typeof path === 'number';
		if ( !isNum || !Number.isInteger( path, ) ) {
			return;
		}

		if ( path < 0 ) {
			return ( currentTarget as unknown[] ).length + path;
		}

		return path;
	}

	return typeof path === 'string' ? path : undefined;
}

export default function deepAccess<
	S extends object,
	AP extends Array<string | number>,
>(
	state: S | null | undefined,
	arrayPath: AP,
	updater?: ( oldValue: unknown ) => unknown,
) {
	if ( isNil( state, ) ) {
		return;
	}

	let parent;
	let value: unknown = state;
	const pathArr: Array<string | number> = [];
	const pathLen = arrayPath.length;
	const lastIndex = pathLen - 1;

	for ( let i = 0; i < arrayPath.length; i++ ) {
		const path = arrayPath[ i ];
		const key = getKey( path, value, );
		parent = value;
		if ( !updater ) {
			if ( isNil( value, ) ) {
				return value;
			}

			if ( isNil( key, ) ) {
				return;
			}

			value = reflectGet( parent as object, key, );
			continue;
		}

		if ( !isObj( value, ) ) {
			pathArr.push( path, );
			throw new Error( `${pathArr.map( String, ).join( '.', )} is invalid target type of ${typeof value}. Must be array or object`, );
		}

		if ( isNil( key, ) ) {
			pathArr.push( path, );
			throw new Error( `Invalid target key: ${pathArr.map( String, ).join( '.', )} of type ${typeof key}`, );
		}

		if ( typeof key === 'number' && key < 0 ) {
			pathArr.push( key, );
			const len = ( value as unknown[] ).length;
			if ( -key > len ) {
				throw new Error( `Array index for ${pathArr.map( String, ).join( '.', )} was out of bounds for array length ${len}`, );
			}
		}

		pathArr.push( path, );

		value = reflectGet( parent as object, key, );

		if ( i === lastIndex ) {
			const newValue = updater( value, );
			if ( objectIs( value, newValue, ) ) {
				return;
			}
			if ( isObj( parent, ) ) {
				reflectSet( parent, key, newValue, );
			}
			return newValue;
		}

		// Create intermediate objects/arrays if needed
		if ( isNil( value, ) ) {
			value = typeof arrayPath[ i + 1 ] === 'number' ? [] : {};
			reflectSet( parent as object, key, value, );
		}
	}

	return value;
}
