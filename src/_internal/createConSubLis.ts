import type { ActRecord, } from '../types/ActRecord';
import type { CreateConOptions, } from '../types/CreateConOptions';
import type { CreateConSubLisReturn, } from '../types/createConSubLisReturn';
import type { DS, } from '../types/DS';
import createCon from './createCon';

export default function createConSubLis<
	S extends DS,
	AR extends ActRecord,
>(
	initial: S,
	options?: CreateConOptions<S, AR>,
): CreateConSubLisReturn<S, AR> {
	const estado = createCon(
		initial,
		{
			...options,
			dispatcher( nextHistory, ) {
				options?.dispatcher?.( nextHistory, );
				listeners.forEach( listener => listener(), );
			},
		},
	);
	const listeners = new Set<() => void>();
	function subscribe( listener: () => void, ) {
		listeners.add( listener, );
		return () => {
			listeners.delete( listener, );
		};
	}

	return {
		...estado,
		subscribe,
		listeners,
	};
}
