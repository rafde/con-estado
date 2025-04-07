import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import type { HistoryState, } from '../types/HistoryState';
import deepUpdate from './deepUpdate';
import findChanges from './findChanges';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import { reflectGet, reflectSet, } from './reflect';

const PROP_TO_HISTORY = {
	changesProp: 'changes',
	prevInitialProp: 'prevInitial',
	prevProp: 'prev',
} as const;

type HistoryPropKeys = keyof typeof PROP_TO_HISTORY;

export default function callbackPropsProxy<
	S extends DS,
>( {
	historyDraft,
	history,
	statePathArray,
}: {
	historyDraft: Draft<HistoryState<S>>
	history: History<S>
	statePathArray?: Array<string | number>
}, ) {
	const baseTarget = {
		prev: history.prev,
		prevInitial: history.prevInitial,
		state: historyDraft.state,
		initial: historyDraft.initial,
	};
	const hasStatePath = Boolean( statePathArray, );

	return new Proxy( baseTarget, {
		get( target, prop, ) {
			if ( prop in baseTarget ) {
				return reflectGet( baseTarget, prop, );
			}

			const isChangesProp = hasStatePath && prop === 'changesProp';
			const isChange = prop === 'changes';
			const hasChanges = isChange || isChangesProp;
			if ( hasChanges && !( 'changes' in baseTarget ) ) {
				const changes = findChanges(
					history.initial,
					history.state,
				);
				reflectSet( baseTarget, 'changes', changes, );

				if ( isChange ) {
					return changes;
				}
			}

			// Handle history property lookups
			if ( !( prop in baseTarget ) && statePathArray && prop in PROP_TO_HISTORY ) {
				const propKey = prop as HistoryPropKeys;
				const [value,] = getDeepValueParentByArray(
					reflectGet( baseTarget, PROP_TO_HISTORY[ propKey ], ),
					statePathArray,
				);
				reflectSet( baseTarget, propKey, value, );
				return value;
			}

			const isDraftProp = hasStatePath && ( prop === 'stateProp' || prop === 'initialProp' );
			if ( statePathArray && isDraftProp ) {
				const draft = prop === 'stateProp' ? historyDraft.state : historyDraft.initial;
				return getDeepValueParentByArray( draft, statePathArray, )[ 0 ];
			}
		},

		set( _target, prop, value, ) {
			if ( statePathArray && ( prop === 'initialProp' || prop === 'stateProp' ) ) {
				const draft = prop === 'stateProp' ? historyDraft.state : historyDraft.initial;
				deepUpdate( draft, statePathArray, () => value, );
				return true;
			}

			return false;
		},
	}, );
}
