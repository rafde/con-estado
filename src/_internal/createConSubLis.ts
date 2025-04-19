import type { CreateConSubLisReturn, } from '../types/CreateConSubLisReturn';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { GetSnapshot, } from '../types/GetSnapshot';
import type { ConOptions, } from '../types/ConOptions';
import createCon from './createCon';

/**
 * Creates a state container with subscription capabilities
 *
 * @template S - The data structure type extending DS (must be a plain object or array)
 * @template AR - Action Record type defining custom action handlers
 * @template SP - Additional selector props type
 *
 * @param {S} initial - Initial state value
 * @param {GetSnapshot<S, AR, SP>} getSnapshot - Function to create a snapshot of the current state
 * @param {ConOptions<S, AR>} [options] - Configuration options
 *
 * @returns {CreateConSubLisReturn<S, AR, ReturnType<GetSnapshot<S, AR, SP>>>}
 *   Object containing state manipulation methods, custom actions, and subscription functionality
 *
 * @remarks
 * This function extends createCon with subscription capabilities.
 * It maintains a set of listeners that are notified when the state changes.
 * The subscribe method allows components to register for state updates.
 *
 * @internal
 * This is an internal function used by createConStore and should not be used directly.
 */
export default function createConSubLis<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
>(
	initial: S,
	getSnapshot: GetSnapshot<S, AR, SP>,
	options?: ConOptions<S, AR>,
): CreateConSubLisReturn<S, AR, ReturnType<GetSnapshot<S, AR, SP>>> {
	const estado = createCon(
		initial,
		{
			...options,
			dispatcher( nextHistory, ) {
				const snapshot = getSnapshot( nextHistory, );
				listeners.forEach( listener => listener( snapshot, ), );
			},
		},
	);
	const listeners: CreateConSubLisReturn<S, AR, ReturnType<GetSnapshot<S, AR, SP>>>['listeners'] = new Set();
	const subscribe: CreateConSubLisReturn<S, AR, ReturnType<GetSnapshot<S, AR, SP>>>['subscribe'] = ( listener, ) => {
		listeners.add( listener, );
		return () => {
			listeners.delete( listener, );
		};
	};

	return {
		...estado,
		subscribe,
		listeners,
	};
}
