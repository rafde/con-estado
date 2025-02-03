import { useState, } from 'react';
import createCon from './_internal/createCon';
import createConActs from './_internal/createConActs';
import defaultSelector from './_internal/defaultSelector';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { UseEstadoProps, } from './types/UseEstadoProps';

export default function useCon<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: UseEstadoProps<State, Acts>,
) {
	const [
		state,
		setState,
	] = useState( () => {
		const conProps = createCon( initial, options, );

		const conActProps = {
			...conProps,
			getDraft( ...args: Parameters<typeof conProps.getDraft> ) {
				const [
					draft,
					_finalize,
				] = conProps.getDraft( ...args, );

				function finalize() {
					const oldHistory = conProps.get();
					const results = _finalize();
					const newHistory = conProps.get();
					if ( oldHistory === newHistory ) {
						return results;
					}
					setState( defaultSelector<State, Acts>( {
						...propsConActs.get(),
						...propsConActs,
					}, ), );
					return results;
				}

				return [
					draft,
					finalize,
				];
			},
			reset() {
				const oldHistory = conProps.get();
				const results = conProps.reset();
				const newHistory = conProps.get();
				if ( oldHistory === newHistory ) {
					return results;
				}
				setState( defaultSelector<State, Acts>( {
					...propsConActs.get(),
					...propsConActs,
				}, ), );
				return results;
			},
			set( ...args: Parameters<typeof conProps.set> ) {
				const oldHistory = conProps.get();
				const results = conProps.set( ...args, );
				const newHistory = conProps.get();
				if ( oldHistory === newHistory ) {
					return results;
				}
				setState( defaultSelector<State, Acts>( {
					...propsConActs.get(),
					...propsConActs,
				}, ), );
				return results;
			},
		} as typeof conProps;
		const propsConActs = createConActs( conActProps, options?.acts, );

		return defaultSelector<State, Acts>( {
			...propsConActs,
			...conActProps.get(),
		}, );
	}, );

	return state;
}
