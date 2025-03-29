import { create, isDraft, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { ConOptions, } from '../types/ConOptions';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import type { ConMutOptions, } from '../types/ConMutOptions';
import createDraftChangeTrackingProxy from './createChangeTrackingProxy';
import createHistoryProxy from './createHistoryProxy';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isNil from './isNil';
import isStr from './isStr';
import parseSegments from './parseSegments';

export default function getHistoryDraft<
	S extends DS,
	MO extends ConMutOptions = ConMutOptions,
>(
	history: History<S>,
	setHistory: ( nextHistory: History<S>, ) => History<S>,
	beforeChange: Exclude<ConOptions<S, ActRecord, MO>['beforeChange'], undefined>,
	stateHistoryPath?: unknown,
	mutOptions?: MO,
) {
	const [
		historyDraft,
		_finalize,
	] = create(
		{
			initial: history.initial,
			state: history.state,
		},
		{
			...mutOptions,
			enablePatches: false,
		},
	);
	const [
		draft,
		patches,
	] = createDraftChangeTrackingProxy( historyDraft, );

	function finalize( type: 'set' | 'reset' | 'merge' | 'commit' | 'wrap' = 'set', ) {
		beforeChange( {
			historyDraft,
			history,
			type,
			patches,
		}, );
		const next = _finalize() as History<S>;
		const areStatesEqual = Object.is( history.state, next.state, );
		const areInitialsEqual = Object.is( history.initial, next.initial, );
		if ( areStatesEqual && areInitialsEqual ) {
			return history;
		}
		next.prev = areStatesEqual ? history.prev : history.state;
		next.prevInitial = areInitialsEqual ? history.prevInitial : history.initial;
		const nextHistory = createHistoryProxy( next, );

		return setHistory( nextHistory, );
	}

	if ( isStr( stateHistoryPath, ) ) {
		const value = getDeepValueParentByArray(
			draft,
			parseSegments( stateHistoryPath, ),
		)[ 0 ];
		if ( isNil( value, ) || !isDraft( value, ) ) {
			throw new Error( `Key path ${stateHistoryPath} cannot be a draft. It's value is ${draft} of type ${typeof draft}`, );
		}
		return [
			value,
			finalize,
		] as const;
	}

	return [
		draft,
		finalize,
	] as const;
}
