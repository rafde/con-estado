// import { strictDeepEqual, } from 'fast-equals';
import type { DS, } from '../types/DS';
import isPlainObject from './isPlainObject';

function setChanges<T,>( a: T, b: T, changes: DS, key: string | number, ): boolean {
	const aValue = isPlainObject( a, ) || Array.isArray( a, )
		? Reflect.get( a, key, )
		: a;
	const bValue = isPlainObject( b, ) || Array.isArray( b, )
		? Reflect.get( b, key, )
		: b;
	if ( aValue === bValue ) {
		return false;
	}
	const areObjects = isPlainObject( aValue, ) && isPlainObject( bValue, );
	const areArrays = Array.isArray( aValue, ) && Array.isArray( bValue, );
	if ( !areObjects && !areArrays ) {
		Reflect.set( changes, key, bValue, );
		return true;
	}
	const nestedChanges = findChanges( aValue, bValue, );
	if ( nestedChanges != null ) {
		Reflect.set( changes, key, nestedChanges, );
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
		const maxLength = Math.max( a.length, b.length, );
		changes = new Array( maxLength, );

		for ( let key = 0; key < maxLength; key++ ) {
			changes[ key ] = undefined;
			const _hasChanges = setChanges(
				a,
				b,
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
				a,
				b,
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
