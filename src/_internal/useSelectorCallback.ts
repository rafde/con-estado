import { createCustomEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, } from 'react';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Selector, } from '../types/Selector';

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
>( defaultSelector: Selector<S, AR>, selector?: Selector<S, AR>, ) {
	const _selector = useMemo(
		() => {
			if ( typeof selector === 'function' ) {
				return selector;
			}
			return defaultSelector;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const resultRef = useRef( null as unknown, );
	return useCallback(
		( snapshot: Parameters<Selector<S, AR>>[0], ) => {
			const next = _selector( snapshot, );
			const prev = resultRef.current;
			resultRef.current = prev == null
				? next
				: isEqual( prev, next, )
					? prev
					: next;
			return resultRef.current;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
}
