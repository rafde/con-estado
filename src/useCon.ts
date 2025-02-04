import { useState, } from 'react';
import createCon from './_internal/createCon';
import createConActs from './_internal/createConActs';
import defaultSelector from './_internal/defaultSelector';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { UseEstadoProps, } from './types/UseEstadoProps';
import type { Selector, } from './types/Selector';

export default function useCon<
	State extends DS,
	Acts extends ActRecord,
	Sel extends Selector<State, Acts>
>(
	initial: State,
	options: UseEstadoProps<State, Acts> & { selector: Sel }
): ReturnType<Sel>;
export default function useCon<
	State extends DS,
	Acts extends ActRecord
>(
	initial: State,
	options?: Omit<UseEstadoProps<State, Acts>, 'selector'>
): ReturnType<typeof defaultSelector<State, Acts>>;
export default function useCon<
	State extends DS,
	Acts extends ActRecord
>(
	initial: State,
	options?: UseEstadoProps<State, Acts>,
) {
	const [
		state,
		setState,
	] = useState( () => {
		const {
			selector = defaultSelector<State, Acts>,
			..._options
		} = options ?? {};
		const conProps = createCon( initial, _options, );

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
					setState( selector( {
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
				setState( selector( {
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
				setState( selector( {
					...propsConActs.get(),
					...propsConActs,
				}, ), );
				return results;
			},
		} as typeof conProps;
		const propsConActs = createConActs( conActProps, options?.acts, );

		return selector( {
			...propsConActs,
			...conActProps.get(),
		}, );
	}, );

	return state;
}
