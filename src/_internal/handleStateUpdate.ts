import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isFunc from './isFunc';
import isObj from './isObj';
import isPlainObj from './isPlainObj';
import isStr from './isStr';
import isUndef from './isUndef';
import isValidStatePath from './isValidStatePath';
import parseSegments from './parseSegments';

export default function handleStateUpdate<
	S extends DS,
>(
	historyDraft: Draft<{
		initial: S
		state: S
	}>,
	history: History<S>,
	args: unknown[],
	finalize: () => History<S>,
) {
	const [statePath, nextState,] = args;

	// Handle function-based root update
	if ( isFunc( statePath, ) ) {
		statePath( {
			...history,
			historyDraft,
		}, );
		return finalize();
	}

	// Handle path-based updates
	if ( isValidStatePath( statePath, ) ) {
		const statePathArray = isStr( statePath, )
			? parseSegments( statePath, )
			: statePath as ( string | number )[];

		const valueKey = statePathArray.at( -1, );
		const [draft, parentDraft,] = getDeepValueParentByArray( historyDraft, statePathArray, );
		const pathArray = statePathArray.slice( 1, );

		if ( isFunc( nextState, ) && isPlainObj( draft, ) ) {
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
		else if ( isObj( parentDraft, ) && typeof valueKey !== 'undefined' && valueKey in parentDraft ) {
			if ( isFunc( nextState, ) ) {
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
	else if ( isUndef( nextState, ) && isPlainObj( statePath, ) ) {
		Object.assign( historyDraft, statePath, );
	}

	return finalize();
}
