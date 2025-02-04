import { useState, } from 'react';
import createCon from './_internal/createCon';
import createConActs from './_internal/createConActs';
import defaultSelector from './_internal/defaultSelector';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { UseEstadoProps, } from './types/UseEstadoProps';
import type { Selector, } from './types/Selector';
// @ts-expect-error -- here for tsdocs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OptionCompare, } from './types/OptionCompare';
// @ts-expect-error -- here for tsdocs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OptionAfterChange, } from './types/OptionAfterChange';

/**
 * A React hook for managing state with history tracking and actions.
 *
 * @param {DS} initial - The initial state object
 * @param {UseEstadoProps<DS, ActRecord>} [options] - Configuration options
 * @param {CreateActs<DS, ActRecord>} [options.acts] - A function to create a Record of action functions that modify state
 * @param {OptionCompare<DS>} [options.compare] - Custom comparison function to determine if state has changed
 * @param {OptionAfterChange<DS>} [options.afterChange] - Callback function executed asynchronously after state changes
 * @param {Selector<DS, ActRecord>} [options.selector=typeof defaultSelector<DS, ActRecord>] - Function to select and transform state values
 *
 * @returns {ReturnType<Selector<DS, ActRecord>> | ReturnType<typeof defaultSelector<DS, ActRecord>>}
 * Returns either:
 * - The result of the custom selector if provided
 * - The default selection (state + actions) if no selector is provided
 *
 * @example
 * ```typescript
 * // Basic usage with compare and afterChange
 * const [
 * 	items,
 *  controls
 * ] = useCon({
 *   items: []
 * }, {
 *   acts({set}) {
 *     return {
 *       addItem: (item) => {
 *         set( 'state.items', ({draft}) => {
 *           draft.push( item );
 *         } );
 *       }
 *     }
 *   },
 *   compare: (prev, next, { cmp, key, keys, }) => {
 *     if ( key === 'items' ) {
 *       return cmp( prev, next );
 *     }
 *     return cmp( prev, next );
 *   },
 *   afterChange: (newState) => console.log('Items updated:', newState.items)
 * });
 * controls.acts.addItem( 'foo' );
 *
 * // With custom selector
 *  const {itemCount, set} = useCon(
 *    { items: [] },
 *    {
 *      selector: ({state, set}) => ({
 *        itemCount: state.items.length,
 *        set,
 *      })
 *    }
 *  );
 *
 *  set( 'items', ({draft}) => {
 *    draft.push( 'foo' );
 *  } );
 *
 * ```
 */
export default function useCon<
	State extends DS,
	Acts extends ActRecord,
	Sel extends Selector<State, Acts>,
>(
	initial: State,
	options: UseEstadoProps<State, Acts> & { selector: Sel }
): ReturnType<Sel>;
export default function useCon<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Omit<UseEstadoProps<State, Acts>, 'selector'>
): ReturnType<typeof defaultSelector<State, Acts>>;
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
