import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { History, } from '../types/History';

import callbackPropsProxy from './callbackPropsProxy';
import isFunc from './isFunc';
import isStr from './isStr';
import parseSegments from './parseSegments';

export default function handleCommit<
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
		throw new Error( '`commit` needs a callback function', );
	}

	const [historyDraft, finalize,] = getDraft();
	if ( isStatePathFunction ) {
		statePath(
			callbackPropsProxy( {
				historyDraft,
				history,
			}, ),
		);

		return finalize( 'commit', );
	}

	if ( !isNextStateType ) {
		throw new Error( '`commit` method second parameter needs a callback function', );
	}

	const statePathArray = isStr( statePath, )
		? parseSegments( statePath, )
		: statePath as Array<string | number>;

	if ( !statePathArray ) {
		throw new Error( '`commit` method first parameter needs a valid state path string or array', );
	}

	nextState(
		callbackPropsProxy( {
			historyDraft,
			history,
			statePathArray,
		}, ),
	);

	return finalize( 'commit', );
}
