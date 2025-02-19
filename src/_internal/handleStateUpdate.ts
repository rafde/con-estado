import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isFunction from './isFunction';
import isObject from './isObject';
import isPlainObject from './isPlainObject';
import isString from './isString';
import isUndefined from './isUndefined';
import isValidStatePath from './isValidStatePath';

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
	if ( isFunction( statePath, ) ) {
		statePath( {
			...history,
			historyDraft,
		}, );
		return finalize();
	}

	// Handle path-based updates
	if ( isValidStatePath( statePath, ) ) {
		const statePathArray = isString( statePath, )
			? getCacheStringPathToArray( arrayPathMap, statePath, )
			: statePath as ( string | number )[];

		const valueKey = statePathArray.at( -1, );
		const [draft, parentDraft,] = getDeepValueParentByArray( historyDraft, statePathArray, );
		const pathArray = statePathArray.slice( 1, );

		if ( isFunction( nextState, ) && isPlainObject( draft, ) ) {
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
		else if ( isObject( parentDraft, ) && typeof valueKey !== 'undefined' && valueKey in parentDraft ) {
			if ( isFunction( nextState, ) ) {
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
	else if ( isUndefined( nextState, ) && isPlainObject( statePath, ) ) {
		Object.assign( historyDraft, statePath, );
	}

	return finalize();
}
