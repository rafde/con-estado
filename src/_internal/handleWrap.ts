import { current, isDraft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { History, } from '../types/History';
import callbackPropsProxy from './callbackPropsProxy';
import isFunc from './isFunc';
import isObj from './isObj';
import isStr from './isStr';
import isValidStatePath from './isValidStatePath';
import parseSegments from './parseSegments';

const _isPromiseLike = <T,>( value: unknown, ): value is PromiseLike<T> => isObj( value, )
	&& 'then' in value && isFunc( value?.then, );

export default function handleWrap<
	S extends DS,
>(
	getDraft: GetDraftRecord<S>['getDraft'],
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

	const statePathArray = isStr( statePath, )
		? parseSegments( statePath, )
		: Array.isArray( statePath, )
			? statePath as Array<string | number>
			: null;

	return function wrap( ...wrapArgs: unknown[] ) {
		const [historyDraft, finalize,] = getDraft();
		let result: unknown;
		if ( isStatePathFunction ) {
			result = statePath(
				callbackPropsProxy( {
					historyDraft,
					history,
				}, ),
				...wrapArgs,
			);
		}
		else if ( _isValidStatePath && isNextStateType && statePathArray ) {
			result = nextState(
				callbackPropsProxy( {
					historyDraft,
					history,
					statePathArray,
				}, ),
				...wrapArgs,
			);
		}

		if ( _isPromiseLike( result, ) ) {
			return result.then( ( res, ) => {
				const final = isDraft( res, ) ? current( res as object, ) : res;
				finalize( 'wrap', );
				return final;
			}, );
		}

		const final = isDraft( result, ) ? current( result as object, ) : result;
		finalize( 'wrap', );
		return final;
	};
}
