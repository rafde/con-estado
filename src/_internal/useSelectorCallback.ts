import { createCustomEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, } from 'react';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Selector, } from '../types/Selector';
import isFunction from './isFunction';

const isEqual = createCustomEqual( {
	strict: true,
	createCustomConfig() {
		return {
			areFunctionsEqual: () => true,
		};
	},
}, );

export default function useSelectorCallback<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
>( defaultSelector: Selector<S, AR, SP>, selector?: Selector<S, AR, SP>, ) {
	const _selector = useMemo(
		() => {
			if ( isFunction( selector, ) ) {
				return selector;
			}
			return defaultSelector;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const resultRef = useRef( null as unknown, );
	return useCallback(
		( snapshot: Parameters<Selector<S, AR, SP>>[0], ) => {
			const next = _selector( snapshot, );
			const prev = resultRef.current;
			if ( isEqual( prev, next, ) ) {
				return resultRef.current;
			}
			resultRef.current = next;
			return resultRef.current;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
}
