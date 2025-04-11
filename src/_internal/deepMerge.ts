import { isDraft, original, } from 'mutative';
import { isObj, isPlainObj, isUndef, } from './is';
import isArray from './isArray';
import objectIs from './objectIs';
import { reflectGet, reflectSet, } from './reflect';

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
	if ( !isArray( target, ) ) {
		return source;
	}

	const sLen = source.length;
	for ( let i = 0; i < sLen; i++ ) {
		const arrSourceValue = source[ i ];
		const arrTargetValue = target[ i ];

		// don't overwrite with undefined
		if ( isUndef( arrSourceValue, ) || setRef( arrSourceValue, refSet, ) || setRef( arrTargetValue, refSet, ) ) {
			continue;
		}

		if ( isPlainObj( arrSourceValue, ) || isArray( arrSourceValue, ) ) {
			const result = deepMerge( arrTargetValue, arrSourceValue, refSet, );
			if ( !objectIs( arrTargetValue, result, ) ) {
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
		const sourceValue = reflectGet( source, key, );
		const targetValue = reflectGet( target, key, );

		if ( !isObj( targetValue, ) ) {
			reflectSet( target, key, sourceValue, );
			continue;
		}

		if ( isPlainObj( sourceValue, ) || isArray( sourceValue, ) ) {
			if ( setRef( sourceValue, refSet, ) ) {
				continue;
			}

			deepMerge( targetValue, sourceValue, refSet, );
		}
		else {
			reflectSet( target, key, sourceValue, );
		}
	}

	return target;
}

export default function deepMerge( target: unknown, source: unknown, refSet = new WeakSet(), ) {
	if ( !isObj( target, ) || !isObj( source, ) ) {
		return source;
	}

	if ( isArray( source, ) ) {
		return mergeArray( target, source, refSet, );
	}

	return mergeObject( target, source, refSet, );
}
