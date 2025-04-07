import { createCustomEqual, } from 'fast-equals';
import { useCallback, useRef, } from 'react';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { Selector, } from '../types/Selector';
import type { SelectorProps, } from '../types/SelectorProps';
import type { StringPathToArray, } from '../types/StringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isArray from './isArray';
import isFunc from './isFunc';
import isStr from './isStr';
import parseSegments from './parseSegments';

const isEqual = createCustomEqual( {
	strict: true,
	createCustomConfig() {
		return {
			areFunctionsEqual: () => true,
		};
	},
}, );

const HistoryKeys = new Set( ['state', 'prev', 'initial', 'prevInitial', 'changes',], );

function getSelectorValue<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
>(
	{
		defaultSelector,
		selector,
	}: {
		defaultSelector: Selector<S, AR, SP>
		selector?: unknown
	},
	snapshot: SelectorProps<S, AR, SP>,
) {
	if ( isFunc( selector, ) ) {
		return selector( snapshot, );
	}

	const selectorPath = isStr( selector, ) ? parseSegments( selector, ) : selector;
	if ( isArray( selectorPath, ) ) {
		if ( HistoryKeys.has( selectorPath[ 0 ], ) ) {
			return snapshot.get( selectorPath as StringPathToArray<NestedRecordKeys<History<S>>>, );
		}

		return getDeepValueParentByArray( snapshot, selectorPath, )[ 0 ];
	}

	return defaultSelector( snapshot, );
}

export default function useSelCb<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
>( defaultSelector: Selector<S, AR, SP>, selector?: unknown, ) {
	const selectorRef = useRef( {
		defaultSelector,
		selector,
	}, );

	const resultRef = useRef( undefined as unknown, );

	return useCallback(
		( snapshot: SelectorProps<S, AR, SP>, ) => {
			const next = getSelectorValue( selectorRef.current, snapshot, );
			const prev = resultRef.current;
			if ( isEqual( prev, next, ) ) {
				return resultRef.current;
			}
			resultRef.current = next;
			return resultRef.current;
		},
		[],
	);
}
