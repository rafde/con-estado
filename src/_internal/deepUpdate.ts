import isNil from './isNil';
import isObj from './isObj';
import isPlainObj from './isPlainObj';
import isStr from './isStr';

function getIndex( path: unknown, currentTarget: Array<unknown>, ) {
	const isNum = typeof path === 'number';

	if ( !isNum || !Number.isInteger( path, ) ) {
		return;
	}

	if ( path < 0 ) {
		const index = currentTarget.length + path;
		if ( index < 0 ) {
			return;
		}
		return index;
	}

	return path;
}

function getKey( path: unknown, currentTarget: unknown, ) {
	if ( Array.isArray( currentTarget, ) ) {
		return getIndex( path, currentTarget, );
	}

	if ( !isPlainObj( currentTarget, ) || !isStr( path, ) ) {
		return;
	}

	return path;
}

export default function deepUpdate<T extends object,>( target: T, arrayPath: Array<string | number>, value: unknown, ) {
	const arrayPathLength = arrayPath.length;
	const lastIndex = arrayPathLength - 1;
	let currentTarget: unknown = target;

	for (
		let i = 0, path = arrayPath[ i ];
		i < arrayPathLength;
		path = arrayPath[ ++i ]
	) {
		if ( !isObj( currentTarget, ) ) {
			return;
		}

		const key = getKey( path, currentTarget, );
		if ( isNil( key, ) ) {
			return;
		}

		if ( i === lastIndex ) {
			Reflect.set( currentTarget, key, value, );
			return;
		}

		// how to handle undefined??
		if ( Object.hasOwn( currentTarget, key, ) ) {
			currentTarget = Reflect.get( currentTarget, key, );
			continue;
		}

		const currentValue = typeof arrayPath[ i + 1 ] === 'number' ? [] : {};

		Reflect.set(
			currentTarget,
			key,
			currentValue,
		);

		currentTarget = currentValue;
	}
}
