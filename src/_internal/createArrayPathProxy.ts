import type { Draft, } from 'mutative';
import type { ArrayPathDraftProps, } from '../types/ArrayPathDraftProps';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
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

export default function createArrayPathProxy<
	S extends DS,
	TS extends object,
>(
	targetState: TS,
	history: History<S>,
	arrayPath: ( string | number )[],
	props: {
		draftProp?: string | number
		parentDraft?: Draft<unknown>
		valueProp?: never
	} | {
		draftProp?: never
		parentDraft?: never
		valueProp?: string | number
	} = {},
) {
	const { draftProp, parentDraft, valueProp, } = props;

	// Cache history property lookups
	const propCache = new Map<PropKeys, unknown>();

	function getHistoryProp( historyKey: HistoryKeys, propKey: PropKeys, ) {
		if ( propCache.has( propKey, ) ) {
			return propCache.get( propKey, );
		}
		const [prop,] = getDeepValueParentByArray( history[ historyKey ], arrayPath, );
		propCache.set( propKey, prop, );
		return prop;
	}

	const baseTarget = {
		...history,
		draft: targetState,
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
			if ( prop === 'draft' ) {
				if ( typeof valueProp !== 'undefined' ) {
					return Reflect.get( target.draft, valueProp, );
				}
				return Reflect.get( target, prop, );
			}

			return Reflect.get( target, prop, );
		},

		set( target, prop, value, ) {
			if ( prop === 'draft' ) {
				if ( typeof valueProp !== 'undefined' ) {
					return Reflect.set( target.draft, valueProp, value, );
				}
				if ( parentDraft && typeof draftProp !== 'undefined' ) {
					return Reflect.set( parentDraft, draftProp, value, );
				}
				return Reflect.set( target, prop, value, );
			}
			return false;
		},
	}, );
}
