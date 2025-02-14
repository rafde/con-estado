import { strictDeepEqual, } from 'fast-equals';
import type { DS, } from '../types/DS';
import isPlainObject from './isPlainObject';

function setChanges<T,>( a: T, b: T, changes: DS, key: string | number, ): boolean {
	if ( !strictDeepEqual( a, b, ) ) {
		Reflect.set( changes, key, b, );
		return true;
	}
	return false;
}

export default function findChanges<T extends DS,>( a: T, b: T, ) {
	if ( a === b ) {
		return;
	}
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
			);
			if ( _hasChanges ) {
				hasChanges = true;
			}
		}
	}

	if ( !hasChanges ) {
		return;
	}

	return changes;
}
