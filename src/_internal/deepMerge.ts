import { isDraft, original, } from 'mutative';
import isObj from './isObj';
import isPlainObj from './isPlainObj';
import isUndef from './isUndef';

function setRef( target: unknown, refSet: WeakSet<object>, ) {
	if ( isObj( target, ) ) {
		const ref = isDraft( target, ) ? original( target, ) : target;
		if ( refSet.has( ref, ) ) {
			return true;
		}
		refSet.add( ref, );
		return false;
	}
	return false;
}

function mergeArray( target: unknown, source: unknown[], refSet: WeakSet<object>, ) {
	if ( !Array.isArray( target, ) ) {
		return source;
	}

	const sLen = source.length;
	for ( let i = 0; i < sLen; i++ ) {
		const arrSourceValue = source[ i ];

		// don't overwrite with undefined
		if ( isUndef( arrSourceValue, ) ) {
			continue;
		}

		if ( setRef( arrSourceValue, refSet, ) ) {
			continue;
		}

		const arrTargetValue = target[ i ];

		if ( setRef( arrTargetValue, refSet, ) ) {
			continue;
		}

		if ( isPlainObj( arrSourceValue, ) || Array.isArray( arrSourceValue, ) ) {
			const result = deepMerge( arrTargetValue, arrSourceValue, refSet, );
			if ( !Object.is( arrTargetValue, result, ) ) {
				target[ i ] = result;
			}
			continue;
		}
		target[ i ] = arrSourceValue;
	}

	return target;
}

function mergeObject( target: unknown, source: unknown, refSet: WeakSet<object>, ) {
	if ( !isPlainObj( target, ) || !isPlainObj( source, ) ) {
		return source;
	}

	for ( const key in source ) {
		const sourceValue = Reflect.get( source, key, );
		const targetValue = Reflect.get( target, key, );

		if ( !isObj( targetValue, ) ) {
			Reflect.set( target, key, sourceValue, );
			continue;
		}

		if ( isPlainObj( sourceValue, ) || Array.isArray( sourceValue, ) ) {
			if ( setRef( sourceValue, refSet, ) ) {
				continue;
			}

			deepMerge( targetValue, sourceValue, refSet, );
		}
		else {
			Reflect.set( target, key, sourceValue, );
		}
	}

	return target;
}

export default function deepMerge( target: unknown, source: unknown, refSet = new WeakSet(), ) {
	if ( !isObj( target, ) || !isObj( source, ) ) {
		return source;
	}

	if ( Array.isArray( source, ) ) {
		return mergeArray( target, source, refSet, );
	}

	return mergeObject( target, source, refSet, );
}
