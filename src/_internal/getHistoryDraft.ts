import { strictDeepEqual, } from 'fast-equals';
import { create, isDraft, type Draft, type Options as MutOptions, } from 'mutative';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { OptionTransform, } from '../types/OptionTransform';
import findChanges from './findChanges';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';

export default function getHistoryDraft<
	S extends DS,
	MO extends MutOptions<false, boolean> = MutOptions<false, false>,
>(
	history: EstadoHistory<S>,
	setHistory: ( nextHistory: EstadoHistory<S>, ) => EstadoHistory<S>,
	arrayPathMap: Map<string | number, Array<string | number>>,
	transform: OptionTransform<S>,
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

	function finalize() {
		transform( _draft, history, type, );
		const next = _finalize();
		let {
			initial,
			state,
		} = next;

		const hasNoStateChanges = strictDeepEqual( history.state, state, );
		const hasNoInitialChanges = strictDeepEqual( history.initial, initial, );

		if ( hasNoStateChanges && hasNoInitialChanges ) {
			return history;
		}

		if ( hasNoStateChanges ) {
			state = history.state;
		}

		if ( hasNoInitialChanges ) {
			initial = history.initial;
		}

		const changes = findChanges(
			initial as S,
			state as S,
		) as EstadoHistory<S>['changes'];
		const nextHistory: EstadoHistory<S> = {
			changes,
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
		const value = getDeepValueParentByArray(
			_draft,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
		)[ 0 ];
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
