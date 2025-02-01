import type { DS, } from '../types/DS';
import type { CompareCallbackReturn, } from './compareCallback';
import isPlainObject from './isPlainObject';

function setChanges<T,>( a: T, b: T, changes: DS, key: string | number, compare: CompareCallbackReturn, ): boolean {
	if ( !compare( a, b, key as string, [key as string,], ) ) {
		Reflect.set( changes, key, b, );
		return true;
	}
	return false;
}

export default function findChanges<T extends DS,>( a: T, b: T, compare: CompareCallbackReturn, ) {
	let changes: Record<string, unknown> | Array<unknown> = {};
	let hasChanges = false;
	if ( Array.isArray( a, ) && Array.isArray( b, ) ) {
		const arr = a.length > b.length ? a : b;
		changes = new Array( arr.length, );

		for ( let key = 0; key < arr.length; key++ ) {
			changes[ key ] = undefined;
			const _hasChanges = setChanges(
				Reflect.get( a, key, ),
				Reflect.get( b, key, ),
				changes,
				key,
				compare,
			);
			if ( _hasChanges ) {
				hasChanges = true;
			}
		}
	}
	else if ( isPlainObject( a, ) && isPlainObject( b, ) ) {
		for ( const key in a ) {
			const _hasChanges = setChanges(
				Reflect.get( a, key, ),
				Reflect.get( b, key, ),
				changes,
				key,
				compare,
			);
			if ( _hasChanges ) {
				hasChanges = true;
			}
		}
	}

	if ( !hasChanges ) {
		return { changes: undefined, };
	}

	return { changes, };
}
