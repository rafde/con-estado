import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import type { History, } from '../types/History';
import type { HistoryState, } from '../types/HistoryState';
import type { NestedObjectKeys, } from '../types/NestedObjectKeys';
import type { StringPathToArray, } from '../types/StringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';

const PROP_TO_HISTORY = {
	changesProp: 'changes',
	initialProp: 'initial',
	prevInitialProp: 'prevInitial',
	prevProp: 'prev',
	stateProp: 'state',
} as const;

type PropKeys = keyof typeof PROP_TO_HISTORY;
type HistoryKeys = typeof PROP_TO_HISTORY[PropKeys];
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

export default function createArrayPathProxy<
	S extends DS,
	D extends object,
>( {
	pathArray,
	draft,
	historyDraft,
	parentDraft,
	history,
	valueKey,
}: {
	pathArray: Array<string | number>
	draft: D
	historyDraft: Draft<HistoryState<S>>
	parentDraft?: Draft<unknown>
	history: History<S>
	valueKey?: string | number
}, ) {
	// Cache history property lookups
	const propCache = new Map<PropKeys, unknown>();

	function getHistoryProp( historyKey: HistoryKeys, propKey: PropKeys, ) {
		if ( propCache.has( propKey, ) ) {
			return propCache.get( propKey, );
		}
		const [prop,] = getDeepValueParentByArray( history[ historyKey ], pathArray, );
		propCache.set( propKey, prop, );
		return prop;
	}

	const baseTarget: ArrayPathDraftProps<S, DS, StringPathToArray<NestedObjectKeys<DS>>> = {
		...history,
		draft,
		historyDraft,
	} as ArrayPathDraftProps<S, DS, StringPathToArray<NestedObjectKeys<DS>>>;

	return new Proxy( baseTarget, {
		get( target, prop, ) {
			// Handle history property lookups
			if ( prop in PROP_TO_HISTORY ) {
				const historyPropKey = prop as PropKeys;
				const value = getHistoryProp( PROP_TO_HISTORY[ historyPropKey ], historyPropKey, );
				target[ historyPropKey ] = value as never;
				return value;
			}

			// Handle draft property
			if ( prop === 'draft' && typeof parentDraft === 'undefined' && typeof valueKey !== 'undefined' ) {
				return Reflect.get( target.draft, valueKey, );
			}

			return Reflect.get( target, prop, );
		},

		set( target, prop, value, ) {
			if ( prop === 'draft' ) {
				if ( parentDraft && typeof valueKey !== 'undefined' ) {
					return Reflect.set( parentDraft, valueKey, value, );
				}
				if ( typeof valueKey !== 'undefined' ) {
					return Reflect.set( target.draft, valueKey, value, );
				}
				return Reflect.set( target, prop, value, );
			}
			return false;
		},
	}, );
}
