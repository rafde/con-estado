import type { ConOptions, } from '../types/ConOptions';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import { create, } from 'mutative';
import createHistoryProxy from './createHistoryProxy';
import isNil from './isNil';
import noop from './noop';

export default function reset<S extends DS,>(
	history: History<S>,
	transform: Exclude<ConOptions<S, Record<never, never>>['transform'], undefined> = noop,
) {
	if ( isNil( history.changes, ) ) {
		return history;
	}

	let initial = history.initial;
	let state = history.initial;

	if ( transform !== noop ) {
		const res = create(
			{
				initial,
				state,
			},
			( draft, ) => {
				transform( {
					draft,
					history,
					type: 'reset',
					patches: {},
				}, );
			},
		);

		if ( res.initial !== initial ) {
			initial = res.initial;
		}
		if ( res.state !== state ) {
			state = res.state;
		}
	}

	return createHistoryProxy( {
		initial,
		prev: isNil( history.prev, ) ? undefined : history.state,
		prevInitial: isNil( history.prevInitial, ) ? undefined : history.initial,
		state,
	}, );
}
