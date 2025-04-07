import type { DS, } from '../types/DS';
import isArray from './isArray';
import isPlainObj from './isPlainObj';

function setChanges<T,>( a: T, b: T, changes: DS, key: string | number, ): boolean {
	const aValue = isPlainObj( a, ) || isArray( a, )
		? Reflect.get( a, key, )
		: a;
	const bValue = isPlainObj( b, ) || isArray( b, )
		? Reflect.get( b, key, )
		: b;
	if ( Object.is( aValue, bValue, ) ) {
		return false;
	}
	const areObjects = isPlainObj( aValue, ) && isPlainObj( bValue, );
	const areArrays = isArray( aValue, ) && isArray( bValue, );
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
	if ( Object.is( a, b, ) ) {
		return;
	}
	let changes: Record<string, unknown> | Array<unknown> = {};
	let hasChanges = false;
	if ( isArray( a, ) && isArray( b, ) ) {
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
	else if ( isPlainObj( a, ) && isPlainObj( b, ) ) {
		for ( const key in b ) {
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
