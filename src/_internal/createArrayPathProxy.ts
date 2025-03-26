import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import type { History, } from '../types/History';
import type { HistoryState, } from '../types/HistoryState';
import type { NestedObjectKeys, } from '../types/NestedObjectKeys';
import type { StringPathToArray, } from '../types/StringPathToArray';
import deepUpdate from './deepUpdate';
import getDeepValueParentByArray from './getDeepValueParentByArray';

const PROP_TO_HISTORY = {
	changesProp: 'changes',
	initialProp: 'initial',
	prevInitialProp: 'prevInitial',
	prevProp: 'prev',
	stateProp: 'state',
} as const;

type PropKeys = keyof typeof PROP_TO_HISTORY;
type ArrayPathDraftProps<
	S extends DS,
	TS extends DS,
	SP extends StringPathToArray<NestedObjectKeys<TS>>,
	Sub extends StringPathToArray<NestedObjectKeys<S>> = StringPathToArray<NestedObjectKeys<S>>,
> = {
	changesProp: GetArrayPathValue<History<S>['changes'], Sub>
	initialProp: GetArrayPathValue<History<S>['initial'], Sub>
	prevInitialProp: GetArrayPathValue<History<S>['prevInitial'], Sub>
	prevProp: GetArrayPathValue<History<S>['prev'], Sub>
	stateProp: GetArrayPathValue<History<S>['state'], Sub>
} & Readonly<{
	draft: GetArrayPathValue<Draft<TS>, SP>
	historyDraft: Draft<HistoryState<S>>
}> & History<S>;

function getHistoryPropValue(
	value: object | null | undefined,
	propCache: Map<PropKeys, unknown>,
	propKey: PropKeys,
	pathArray: Array<string | number>,
) {
	if ( propCache.has( propKey, ) ) {
		return propCache.get( propKey, );
	}
	const [prop,] = getDeepValueParentByArray( value, pathArray, );
	propCache.set( propKey, prop, );
	return prop;
}

export default function createArrayPathProxy<
	S extends DS,
>( {
	historyDraft,
	history,
	statePathArray,
}: {
	historyDraft: Draft<HistoryState<S>>
	history: History<S>
	statePathArray: Array<string | number>
}, ) {
	// Cache history property lookups
	const propCache = new Map<PropKeys, unknown>();
	const baseTarget: ArrayPathDraftProps<S, DS, StringPathToArray<NestedObjectKeys<DS>>> = {
		...history,
		historyDraft,
	} as ArrayPathDraftProps<S, DS, StringPathToArray<NestedObjectKeys<DS>>>;
	const pathArray = statePathArray.slice( 1, );

	return new Proxy( baseTarget, {
		get( target, prop, ) {
			// Handle history property lookups
			if ( prop in PROP_TO_HISTORY ) {
				const propKey = prop as PropKeys;
				const historyKey = PROP_TO_HISTORY[ propKey ];
				const historyValue = history[ historyKey ];
				const value = getHistoryPropValue( historyValue, propCache, propKey, pathArray, );
				target[ propKey ] = value as never;
				return value;
			}

			// Handle historyDraft property
			if ( prop === 'draft' ) {
				return getDeepValueParentByArray( historyDraft, statePathArray, )[ 0 ];
			}

			if ( prop in history ) {
				return Reflect.get( history, prop, );
			}

			return Reflect.get( target, prop, );
		},

		set( _target, prop, value, ) {
			if ( prop === 'draft' ) {
				deepUpdate( historyDraft, statePathArray, () => value, );
				return true;
			}
			return false;
		},
	}, );
}
