import { strictDeepEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, useSyncExternalStore, } from 'react';
import defaultSelector from './_internal/defaultSelector';
import createConSubLis from './_internal/createConSubLis';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Selector, } from './types/Selector';
import type { UseEstadoProps, } from './types/UseEstadoProps';

export default function createConStore<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: UseEstadoProps<State, Acts>,
) {
	const {
		selector = defaultSelector<State, Acts>,
		..._options
	} = options ?? {};
	const estadoSubLis = createConSubLis(
		initial,
		{
			..._options,
			dispatcher( nextHistory, ) {
				snapshot = {
					...nextHistory,
					...estado,
				};
				listeners.forEach( listener => listener( snapshot, ), );
			},
		},
	);
	const {
		subscribe,
		listeners,
		...estado
	} = estadoSubLis;
	const initialSnapshot = {
		...estado.get(),
		...estado,
	};
	let snapshot = initialSnapshot;

	function useConSelector(): ReturnType<typeof defaultSelector<State, Acts>>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select: Sel ): ReturnType<Sel>;
	function useConSelector<Sel extends Selector<State, Acts>,>( select?: Sel, ) {
		const _selector = useMemo(
			() => {
				if ( typeof select === 'function' ) {
					return select;
				}
				return selector;
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[],
		);
		const resultRef = useRef( null as ReturnType<typeof _selector>, );
		const selectorCallback = useCallback(
			( snapshot: typeof initialSnapshot, ) => {
				const result = _selector( snapshot, );
				if ( !strictDeepEqual( resultRef.current, result, ) ) {
					resultRef.current = result as ReturnType<typeof _selector>;
				}
				return resultRef.current;
			},
			// eslint-disable-next-line react-hooks/exhaustive-deps
			[],
		);
		// @see {@link https://github.com/facebook/react/blob/main/packages/use-sync-external-store/src/useSyncExternalStoreShimClient.js}
		return useSyncExternalStore(
			subscribe,
			() => selectorCallback( snapshot, ),
			() => selectorCallback( initialSnapshot, ),
		);
	}

	return Object.assign(
		useConSelector,
		estado,
	);
}
