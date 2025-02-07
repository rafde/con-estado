import { useCallback, useMemo, useRef, } from 'react';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { Selector, } from '../types/Selector';
import returnOnChange from './returnOnChange';

export default function useSelectorCallback<
	S extends DS,
	A extends ActRecord,
>( defaultSelector: Selector<S, A>, selector?: Selector<S, A>, ) {
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
		( snapshot: Parameters<Selector<S, A>>[0], ) => {
			const result = _selector( snapshot, );
			resultRef.current = returnOnChange( resultRef.current, result, );
			return resultRef.current;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
}
