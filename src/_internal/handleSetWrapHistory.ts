import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isFunction from './isFunction';
import isObject from './isObject';
import isString from './isString';
import isUndefined from './isUndefined';
import isValidStatePath from './isValidStatePath';

const _isPromiseLike = <T,>( value: unknown, ): value is PromiseLike<T> => isObject( value, )
	&& 'then' in value && isFunction( value?.then, );

export default function handleSetHistoryWrap<
	S extends DS,
>(
	getDraft: GetDraftRecord<S>['getDraft'],
	arrayPathMap: Map<string | number, Array<string | number>>,
	history: History<S>,
	...args: unknown[]
) {
	const [statePath, nextState,] = args;
	const isStatePathFunction = isFunction( statePath, );
	const isNextStateType = isFunction( nextState, );

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
			const statePathArray = isString( statePath, )
				? getCacheStringPathToArray( arrayPathMap, statePath, )
				: statePath as ( string | number )[];
			const valueKey = statePathArray.at( -1, );
			const [, parentDraft,] = getDeepValueParentByArray( historyDraft, statePathArray, );
			if ( !isObject( parentDraft, ) || isUndefined( valueKey, ) || !( valueKey in parentDraft ) ) {
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
