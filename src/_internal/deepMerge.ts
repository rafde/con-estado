import isPlainObject from './isPlainObject';
import isUndefined from './isUndefined';

export function deepMerge<T extends object,>( target: T, source: T, ): void {
	if ( Object.is( target, source, ) ) {
		return;
	}

	for ( const key in source ) {
		if ( !Object.hasOwn( source, key, ) ) {
			continue;
		}

		const sourceValue = source[ key ];
		if ( isUndefined( sourceValue, ) ) {
			continue;
		}

		const targetValue = target[ key ];

		if ( Array.isArray( sourceValue, ) && Array.isArray( targetValue, ) ) {
			const sLen = sourceValue.length;
			for ( let i = 0; i < sLen; i++ ) {
				const arrSourceValue = sourceValue[ i ];

				// don't overwrite with undefined
				if ( isUndefined( arrSourceValue, ) ) {
					continue;
				}

				const arrTargetValue = targetValue[ i ];
				const aresObjects = isPlainObject( arrSourceValue, ) && isPlainObject( arrTargetValue, );
				const areArrays = Array.isArray( arrSourceValue, ) && Array.isArray( arrTargetValue, );
				if ( aresObjects || areArrays ) {
					deepMerge( arrTargetValue, arrSourceValue, );
					continue;
				}

				targetValue[ i ] = arrSourceValue;
			}
		}
		else if ( isPlainObject( sourceValue, ) && isPlainObject( targetValue, ) ) {
			deepMerge( targetValue, sourceValue, );
		}
		else {
			target[ key ] = sourceValue;
		}
	}
}
