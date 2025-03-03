import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isFunc from './isFunc';
import isObj from './isObj';
import isStr from './isStr';
import isUndef from './isUndef';
import isValidStatePath from './isValidStatePath';

const _isPromiseLike = <T,>( value: unknown, ): value is PromiseLike<T> => isObj( value, )
	&& 'then' in value && isFunc( value?.then, );

export default function handleSetHistoryWrap<
	S extends DS,
>(
	getDraft: GetDraftRecord<S>['getDraft'],
	arrayPathMap: Map<string | number, Array<string | number>>,
	history: History<S>,
	...args: unknown[]
) {
	const [statePath, nextState,] = args;
	const isStatePathFunction = isFunc( statePath, );
	const isNextStateType = isFunc( nextState, );

	if ( !isStatePathFunction && !isNextStateType ) {
		throw new Error( 'Wrapper methods needs a callback function to wrap', );
	}

	const _isValidStatePath = isValidStatePath( statePath, );
	if ( _isValidStatePath && !isNextStateType ) {
		throw new Error( 'Wrapper method second parameter needs a callback function to wrap', );
	}

	return function wrap( ...wrapArgs: unknown[] ) {
		const [historyDraft, finalize,] = getDraft();
		let result: unknown;
		if ( isStatePathFunction ) {
			result = statePath(
				{
					...history,
					historyDraft,
				},
				...wrapArgs,
			);
		}
		else if ( _isValidStatePath && isNextStateType ) {
			const statePathArray = isStr( statePath, )
				? getCacheStringPathToArray( arrayPathMap, statePath, )
				: statePath as ( string | number )[];
			const valueKey = statePathArray.at( -1, );
			const [, parentDraft,] = getDeepValueParentByArray( historyDraft, statePathArray, );
			if ( !isObj( parentDraft, ) || isUndef( valueKey, ) || !( valueKey in parentDraft ) ) {
				return;
			}
			const pathArray = statePathArray.slice( 1, );
			result = nextState(
				createArrayPathProxy( {
					draft: parentDraft,
					historyDraft,
					pathArray,
					history,
					valueKey,
				}, ),
				...wrapArgs,
			);
		}

		if ( _isPromiseLike( result, ) ) {
			return result.then( ( res, ) => {
				finalize();
				return res;
			}, );
		}
		finalize();
		return result;
	};
}
