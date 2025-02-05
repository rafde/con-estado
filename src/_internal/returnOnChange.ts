import { strictDeepEqual, } from 'fast-equals';
import isPlainObject from './isPlainObject';

function hasChange<P extends object, N extends object,>( prev: P, next: N, key: keyof P & keyof N, ) {
	const nextValue = next[ key ];

	return typeof nextValue !== 'function' && !strictDeepEqual( nextValue, Reflect.get( prev, key, ), );
}

export default function returnOnChange( prev: unknown, next: unknown, ) {
	if ( prev === 'function' ) {
		return prev;
	}
	if ( prev == null ) {
		return next;
	}
	else if ( isPlainObject( next, ) ) {
		for ( const key in next ) {
			if ( hasChange( prev, next, key as never, ) ) {
				return next;
			}
		}
	}
	else if ( Array.isArray( next, ) ) {
		for ( let i = 0; i < next.length; i++ ) {
			if ( hasChange( prev, next, i as never, ) ) {
				return next;
			}
		}
	}
	else if ( !strictDeepEqual( prev, next, ) ) {
		return next;
	}

	return prev;
}
