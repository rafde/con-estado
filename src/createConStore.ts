import { strictDeepEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, useSyncExternalStore, } from 'react';
import createConSubLis from './createConSubLis';
import type { ActRecord, } from './types/ActRecord';
import type { DefaultSelector, } from './types/DefaultSelector';
import type { EstadoDS, } from './types/EstadoDS';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';

export default function createConStore<
	State extends EstadoDS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Omit<Option<State, Acts>, 'dispatcher'>,
) {
	const estadoSubLis = createConSubLis(
		initial,
		{
			...options,
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
	const defaultSelector: DefaultSelector<State, Acts> = selectorProps => [
		selectorProps.state,
		selectorProps,
	];

	function useConSelector<
		Sel extends Selector<State, Acts> = typeof defaultSelector,
	>( selector?: Sel, ) {
		const _selector = useMemo(
			() => {
				if ( typeof selector === 'function' ) {
					return selector;
				}
				return defaultSelector;
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
		return useSyncExternalStore<ReturnType<typeof _selector>>(
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
