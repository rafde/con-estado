import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isPlainObject from './isPlainObject';

export default function handleStateUpdate<
	S extends DS,
>(
	historyDraft: Draft<{
		initial: S
		state: S
	}>,
	history: History<S>,
	args: unknown[],
	arrayPathMap: Map<string | number, Array<string | number>>,
	finalize: () => History<S>,
) {
	const [statePath, nextState,] = args;

	// Handle function-based root update
	if ( typeof statePath === 'function' ) {
		statePath( {
			...history,
			historyDraft,
		}, );
		return finalize();
	}

	// Handle path-based updates
	if ( typeof statePath === 'string' || Array.isArray( statePath, ) ) {
		const statePathArray = typeof statePath === 'string'
			? getCacheStringPathToArray( arrayPathMap, statePath, )
			: statePath as ( string | number )[];

		const valueKey = statePathArray.at( -1, );
		const [draft, parentDraft,] = getDeepValueParentByArray( historyDraft, statePathArray, );
		const pathArray = statePathArray.slice( 1, );

		if ( typeof nextState === 'function' && isPlainObject( draft, ) ) {
			nextState(
				createArrayPathProxy( {
					pathArray,
					draft,
					historyDraft,
					parentDraft,
					history,
					valueKey,
				}, ),
			);
		}
		else if ( typeof parentDraft === 'object' && typeof valueKey !== 'undefined' && valueKey in parentDraft ) {
			if ( typeof nextState === 'function' ) {
				nextState(
					createArrayPathProxy( {
						draft: parentDraft,
						historyDraft,
						pathArray,
						history,
						valueKey,
					}, ),
				);
			}
			else {
				Reflect.set( parentDraft, valueKey, nextState, );
			}
		}
	}
	else if ( typeof nextState === 'undefined' && isPlainObject( statePath, ) ) {
		Object.assign( historyDraft, statePath, );
	}

	return finalize();
}
