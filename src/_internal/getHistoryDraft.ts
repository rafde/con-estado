import { create, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { ConOptions, } from '../types/ConOptions';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import type { ConMutOptions, } from '../types/ConMutOptions';
import type { Ops, } from '../types/Ops';
import createDraftChangeTrackingProxy from './createChangeTrackingProxy';
import createHistoryProxy from './createHistoryProxy';
import objectIs from './objectIs';

export default function getHistoryDraft<
	S extends DS,
	MO extends ConMutOptions = ConMutOptions,
>(
	history: History<S>,
	setHistory: ( nextHistory: History<S>, ) => History<S>,
	beforeChange: Exclude<ConOptions<S, ActRecord, MO>['beforeChange'], undefined>,
	currentOpId: `${Ops}${number}`,
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

	function finalize( type: Ops, opId: `${Ops}${number}`, ) {
		beforeChange( {
			historyDraft,
			history,
			type,
			patches,
		}, );

		if ( opId !== currentOpId ) {
			return setHistory( history, );
		}

		const next = _finalize() as History<S>;
		const areStatesEqual = objectIs( history.state, next.state, );
		const areInitialsEqual = objectIs( history.initial, next.initial, );
		if ( areStatesEqual && areInitialsEqual ) {
			return setHistory( history, );
		}
		next.prev = areStatesEqual ? history.prev : history.state;
		next.prevInitial = areInitialsEqual ? history.prevInitial : history.initial;
		const nextHistory = createHistoryProxy( next, );

		return setHistory( nextHistory, );
	}

	return [
		draft,
		finalize,
	] as const;
}
