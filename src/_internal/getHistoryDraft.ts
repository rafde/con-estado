import { create, isDraft, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { ConOptions, } from '../types/ConOptions';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import type { ConMutOptions, } from '../types/ConMutOptions';
import createDraftChangeTrackingProxy from './createChangeTrackingProxy';
import createHistoryProxy from './createHistoryProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isNil from './isNil';
import isString from './isString';

export default function getHistoryDraft<
	S extends DS,
	MO extends ConMutOptions = ConMutOptions,
>(
	history: History<S>,
	setHistory: ( nextHistory: History<S>, ) => History<S>,
	arrayPathMap: Map<string | number, Array<string | number>>,
	transform: Exclude<ConOptions<S, ActRecord, MO>['transform'], undefined>,
	type: 'set' | 'reset',
	stateHistoryPath?: unknown,
	mutOptions?: MO,
) {
	const [
		_draft,
		_finalize,
	] = create(
		{
			initial: history.initial,
			state: history.state,
		},
		{
			...mutOptions,
		},
	);
	const [
		draft,
		patches,
	] = createDraftChangeTrackingProxy( _draft, );

	function finalize() {
		transform( {
			draft,
			history,
			type,
			patches,
		}, );
		const next = _finalize() as History<S>;
		if ( history.state === next.state && history.initial === next.initial ) {
			return history;
		}
		next.prev = history.state === next.state ? history.prev : history.state;
		next.prevInitial = history.initial === next.initial ? history.prevInitial : history.initial;
		const nextHistory: History<S> = createHistoryProxy( next, );

		return setHistory( nextHistory, );
	}

	if ( isString( stateHistoryPath, ) ) {
		const value = getDeepValueParentByArray(
			_draft,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
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
