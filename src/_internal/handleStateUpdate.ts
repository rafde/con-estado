import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import deepUpdate from './deepUpdate';
import isPlainObj from './isPlainObj';
import isStr from './isStr';
import isUndef from './isUndef';
import parseSegments from './parseSegments';

export default function handleStateUpdate<
	S extends DS,
>(
	getDraft: GetDraftRecord<S>['getDraft'],
	args: unknown[],
) {
	const [statePath, nextState,] = args;
	const [draftHistory, finalize,] = getDraft();

	if ( isUndef( nextState, ) && isPlainObj( statePath, ) ) {
		const hasState = 'state' in statePath;
		const hasInitial = 'initial' in statePath;

		if ( !hasState && !hasInitial ) {
			throw new Error( 'First parameter needs an object with `state` or `initial` properties', );
		}

		Object.assign( draftHistory, statePath, );

		return finalize();
	}

	// Handle path-based updates
	const statePathArray = isStr( statePath, )
		? parseSegments( statePath, )
		: statePath;

	if ( !Array.isArray( statePathArray, ) ) {
		throw new Error( 'First parameter needs a valid state path string or array', );
	}

	deepUpdate( draftHistory, statePathArray, () => nextState, );

	return finalize();
}
