import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { History, } from '../types/History';
import deepAccess from './deepAccess';
import deepMerge from './deepMerge';
import isPlainObj from './isPlainObj';
import isStr from './isStr';
import isValidStatePath from './isValidStatePath';
import parseSegments from './parseSegments';

export default function merge<S extends DS,>(
	args: unknown[],
	getDraft: GetDraftRecord<S>['getDraft'],
): History<S> {
	const [historyDraft, finalize,] = getDraft();
	const [statePath, nextState,] = args;

	if ( isValidStatePath( statePath, ) ) {
		const statePathArray = isStr( statePath, )
			? parseSegments( statePath, )
			: statePath as Array<string | number>;

		deepAccess( historyDraft, statePathArray, oldValue => deepMerge( oldValue, nextState, ), );
	}
	else if ( isPlainObj( statePath, ) ) {
		deepMerge( historyDraft, statePath, );
	}

	return finalize( 'merge', );
}
