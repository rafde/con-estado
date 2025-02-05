import { strictDeepEqual, } from 'fast-equals';
import isPlainObject from './isPlainObject';

export default function returnOnChange( prev: unknown, next: unknown, ) {
	if ( prev === 'function' ) {
		return prev;
	}
	if ( prev == null ) {
		return next;
	}
	else if ( isPlainObject( next, ) ) {
		for ( const key in next ) {
			const value = next[ key ];
			if ( typeof value !== 'function' && !strictDeepEqual( value, Reflect.get( prev as object, key, ), ) ) {
				return next;
			}
		}
	}
	else if ( Array.isArray( next, ) ) {
		for ( let i = 0; i < next.length; i++ ) {
			const value = next[ i ];
			if ( typeof value !== 'function' && !strictDeepEqual( value, Reflect.get( prev as object, i, ), ) ) {
				return next;
			}
		}
	}
	else if ( !strictDeepEqual( prev, next, ) ) {
		return next;
	}

	return prev;
}
