import { createCustomEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, } from 'react';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { Selector, } from '../types/Selector';
import type { SelectorProps, } from '../types/SelectorProps';
import type { StringPathToArray, } from '../types/StringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
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
>( selector: unknown, snapshot: SelectorProps<S, AR, SP>, ) {
	if ( isFunc( selector, ) ) {
		return selector( snapshot, );
	}

	if ( Array.isArray( selector, ) ) {
		const head = selector[ 0 ];

		if ( HistoryKeys.has( head, ) ) {
			const { get, } = snapshot;
			return get( selector as StringPathToArray<NestedRecordKeys<History<S>>>, );
		}

		return getDeepValueParentByArray( snapshot, selector, )[ 0 ];
	}
}

export default function useSelCb<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
>( defaultSelector: Selector<S, AR, SP>, selector?: unknown, ) {
	const _selector = useMemo(
		() => {
			if ( isFunc( selector, ) ) {
				return selector;
			}

			if ( isStr( selector, ) ) {
				return parseSegments( selector, );
			}

			return defaultSelector;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);
	const resultRef = useRef( null as unknown, );
	return useCallback(
		( snapshot: SelectorProps<S, AR, SP>, ) => {
			const next = getSelectorValue( _selector, snapshot, );
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
