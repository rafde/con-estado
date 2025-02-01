import { strictDeepEqual, } from 'fast-equals';
import { useCallback, useMemo, useRef, useSyncExternalStore, } from 'react';
import createEstadoSubLis from './createEstadoSubLis';
import type { ActRecord, } from './types/ActRecord';
import type { CreateActs, } from './types/CreateActs';
import type { EstadoDS, } from './types/EstadoDS';
import type { EstadoHistory, } from './types/EstadoHistory';
import type { EstadoProps, } from './types/EstadoProps';
import type { Immutable, } from './types/Immutable';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';

export default function createEstadoStore<
	State extends EstadoDS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Omit<Option<State>, 'dispatcher'> | CreateActs<State, Acts, EstadoHistory<State>>,
	createActs?: CreateActs<State, Acts, EstadoHistory<State>>,
) {
	const _options = typeof options === 'object' ? options : {};
	const _createActs = typeof options === 'function' ? options : createActs;
	const estadoSubLis = createEstadoSubLis(
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
		_createActs,
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
	const defaultSelector: Selector<
		State,
		Acts,
		[Immutable<State>, EstadoProps<State, Acts> & Immutable<EstadoHistory<State>>,]
	> = selectorProps => [
		selectorProps.state,
		selectorProps,
	];

	function useEstadoSelector<
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
		useEstadoSelector,
		estado,
	);
}
