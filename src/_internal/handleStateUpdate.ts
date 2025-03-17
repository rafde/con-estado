import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import deepUpdate from './deepUpdate';
import isFunc from './isFunc';
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
			: statePath as Array<string | number>;

		if ( isFunc( nextState, ) ) {
			nextState(
				createArrayPathProxy( {
					historyDraft,
					history,
					statePathArray,
				}, ),
			);
		}
		else {
			deepUpdate( historyDraft, statePathArray, () => nextState, );
		}
	}
	else if ( isUndef( nextState, ) && isPlainObj( statePath, ) ) {
		Object.assign( historyDraft, statePath, );
	}

	return finalize();
}
