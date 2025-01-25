import type { EstadoDS, } from '../types/EstadoDS';
import type { CompareCallbackReturn, } from './compareCallback';
import isPlainObject from './isPlainObject';

function setChanges<T,>( a: T, b: T, changes: EstadoDS, key: string | number, compare: CompareCallbackReturn, ): boolean {
	if ( !compare( a, b, key as string, [key as string,], ) ) {
		Reflect.set( changes, key, b, );
		return true;
	}
	return false;
}

export default function findChanges<T extends EstadoDS,>( a: T, b: T, compare: CompareCallbackReturn, ) {
	let changes;
	let hasChanges = false;
	if ( Array.isArray( a, ) && Array.isArray( b, ) ) {
		const shallowChanges = [] as unknown as T;
		const arr = a.length > b.length ? a : b;

		for ( let key = 0; key < arr.length; key++ ) {
			shallowChanges[ key ] = undefined;
			const _hasChanges = setChanges(
				Reflect.get( a, key, ),
				Reflect.get( b, key, ),
				shallowChanges,
				key,
				compare,
			);
			if ( _hasChanges ) {
				hasChanges = true;
			}
		}
		changes = shallowChanges as unknown as T extends Array<infer U> ? Array<U | undefined> : never;
	}
	else if ( isPlainObject( a, ) && isPlainObject( b, ) ) {
		const shallowChanges = {} as Record<string, unknown>;
		for ( const key in a ) {
			const _hasChanges = setChanges(
				Reflect.get( a, key, ),
				Reflect.get( b, key, ),
				shallowChanges,
				key,
				compare,
			);
			if ( _hasChanges ) {
				hasChanges = true;
			}
		}

		changes = shallowChanges as Partial<T>;
	}

	if ( !hasChanges ) {
		return { changes: undefined, };
	}

	return { changes, };
}
