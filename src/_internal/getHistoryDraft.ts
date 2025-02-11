import { create, isDraft, type Draft, type Options as MutOptions, } from 'mutative';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { CompareCallbackReturn, } from './compareCallback';
import findChanges from './findChanges';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepArrayPath from './getDeepArrayPath';

export default function getHistoryDraft<
	S extends DS,
	MO extends MutOptions<false, boolean> = MutOptions<false, false>,
>(
	history: EstadoHistory<S>,
	compare: CompareCallbackReturn<S>,
	setHistory: ( nextHistory: EstadoHistory<S>, ) => EstadoHistory<S>,
	arrayPathMap: Map<string | number, Array<string | number>>,
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

	function finalize() {
		const next = _finalize();
		let {
			initial,
			state,
		} = next;

		const hasNoStateChanges = compare( history.state, state, 'state', ['state',], );
		const hasNoInitialChanges = compare( history.initial, initial, 'initial', ['initial',], );

		if ( hasNoStateChanges && hasNoInitialChanges ) {
			return history;
		}

		if ( hasNoStateChanges ) {
			state = history.state;
		}

		if ( hasNoInitialChanges ) {
			initial = history.initial;
		}

		const {
			changes,
		} = findChanges(
			initial as S,
			state as S,
			compare as CompareCallbackReturn,
		);
		const nextHistory: EstadoHistory<S> = {
			changes: changes as EstadoHistory<S>['changes'],
			priorInitial: initial !== history.initial ? history.initial : history.priorInitial,
			state: state as S,
			initial: initial as S,
			priorState: state !== history.state ? history.state : history.priorState,
		};

		return setHistory( nextHistory, );
	}

	const draft: Draft<{
		initial: S
		state: S
	}> = _draft;

	if ( typeof stateHistoryPath === 'string' ) {
		const value = getDeepArrayPath(
			_draft,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
		);
		if ( value == null || !isDraft( value, ) ) {
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
