import type { CreateConSubLisReturn, } from '../types/CreateConSubLisReturn';
import type { ActRecord, } from '../types/ActRecord';
import type { DS, } from '../types/DS';
import type { GetSnapshot, } from '../types/GetSnapshot';
import type { ConOptions, } from '../types/ConOptions';
import createCon from './createCon';

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
