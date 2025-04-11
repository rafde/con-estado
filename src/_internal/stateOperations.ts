import { current, isDraft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { History, } from '../types/History';
import callbackPropsProxy from './callbackPropsProxy';
import deepAccess from './deepAccess';
import deepMerge from './deepMerge';
import { isFunc, isObj, isPlainObj, isStr, } from './is';
import isArray from './isArray';
import parseSegments from './parseSegments';

type OperationType = 'set' | 'merge' | 'commit' | 'wrap';

function isValidStatePath( statePath: unknown, ) {
	return isStr( statePath, ) || isArray( statePath, );
}

function validateCallbackFunction( operation: 'commit' | 'wrap', [statePath, nextState,]: unknown[], ) {
	if ( !isFunc( statePath, ) && !isFunc( nextState, ) ) {
		throw new Error( `${operation} needs a callback function`, );
	}
}

function validateSetStateObject( statePath: unknown, ) {
	if ( isPlainObj( statePath, ) && !( 'state' in statePath || 'initial' in statePath ) ) {
		throw new Error( 'Object must have `state` or `initial` properties', );
	}
}

function getStatePathArray( statePath: unknown, ) {
	return isStr( statePath, )
		? parseSegments( statePath, )
		: isArray( statePath, )
			? statePath
			: null;
}

function createCallbackProperties(
	stateDraft: unknown,
	stateHistory: unknown,
	statePathArray?: unknown,
) {
	return {
		historyDraft: stateDraft,
		history: stateHistory,
		statePathArray,
	};
}

function finalizeWrapResult( result: unknown, finalize: ReturnType<GetDraftRecord<DS>['getDraft']>[1], ) {
	const finalValue = isDraft( result, ) ? current( result as object, ) : result;
	finalize( 'wrap', );
	return finalValue;
}

export default function handleStateOperation<State extends DS,>(
	operationType: OperationType,
	getDraft: GetDraftRecord<State>['getDraft'],
	stateHistory: History<State>,
	[statePath, nextState,]: unknown[],
) {
	const isStatePathFunction = isFunc( statePath, );
	const pathArray = getStatePathArray( statePath, );

	if ( operationType === 'wrap' ) {
		validateCallbackFunction( 'wrap', [statePath, nextState,], );
		return function wrapStateOperation( ...wrapArgs: unknown[] ) {
			const [wrapDraft, wrapFinalize,] = getDraft();
			const wrapProps = createCallbackProperties(
				wrapDraft,
				stateHistory,
				!isStatePathFunction && isValidStatePath( statePath, ) && pathArray,
			);

			const props = callbackPropsProxy(
				wrapProps as Parameters<typeof callbackPropsProxy>[0],
			);
			const wrapResult = isStatePathFunction
				? statePath( props, ...wrapArgs, )
				: isFunc( nextState, )
					? nextState( props, ...wrapArgs, )
					: undefined;

			return isObj( wrapResult, ) && 'then' in wrapResult && isFunc( wrapResult.then, )
				? wrapResult.then( ( result: unknown, ) => finalizeWrapResult( result, wrapFinalize, ), )
				: finalizeWrapResult( wrapResult, wrapFinalize, );
		};
	}

	const [stateDraft, finalizeDraft,] = getDraft();

	switch ( operationType ) {
		case 'set': {
			validateSetStateObject( statePath, );
			if ( isPlainObj( statePath, ) && !nextState ) {
				Object.assign( stateDraft, statePath, );
				return finalizeDraft();
			}
			if ( !pathArray ) {
				throw new Error( 'Invalid state path', );
			}
			deepAccess( stateDraft, pathArray, () => nextState, );
			return finalizeDraft();
		}

		case 'merge': {
			if ( isValidStatePath( statePath, ) ) {
				deepAccess( stateDraft, pathArray!, value => deepMerge( value, nextState, ), );
			}
			else if ( isPlainObj( statePath, ) ) {
				deepMerge( stateDraft, statePath, );
			}
			return finalizeDraft( 'merge', );
		}

		case 'commit': {
			validateCallbackFunction( 'commit', [statePath, nextState,], );
			const callbackProps = createCallbackProperties(
				stateDraft,
				stateHistory,
				!isStatePathFunction && pathArray,
			);
			const props = callbackPropsProxy(
				callbackProps as Parameters<typeof callbackPropsProxy>[0],
			);
			if ( isStatePathFunction ) {
				statePath( props, );
			}
			else if ( isFunc( nextState, ) ) {
				nextState( props, );
			}
			return finalizeDraft( 'commit', );
		}
	}
}
