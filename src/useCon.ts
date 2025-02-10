import { useState, } from 'react';

import createCon from './_internal/createCon';
import createConActs from './_internal/createConActs';
import defaultSelector from './_internal/defaultSelector';
import useSelectorCallback from './_internal/useSelectorCallback';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';
// @ts-expect-error -- here for tsdocs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Options as MutOptions, } from 'mutative';
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
 * @param {Option} [options] - Configuration options
 * @param {CreateActs} [options.acts] - A function to create a Record of action functions that modify state
 * @param {OptionCompare} [options.compare] - Custom comparison function to determine if state has changed
 * @param {OptionAfterChange} [options.afterChange] - Callback function executed asynchronously after state changes
 * Subsequent updates will ignore `function` changes.
 * @param {MutOptions} [options.mutOptions={strict: true}] - Mutative options. {enablePatches: true} not supported
 * @param {Selector} selector - Function to select and transform state values
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
 * 	user,
 *  controls
 * ] = useCon({
 *    user: {
 *      count: 0,
 *      text: ''
 *    }
 *    items: []
 *  },
 *  {
 *    compare: (prev, next, { cmp, key, keys, }) => {
 *      if ( key === 'user.count' && next > 10) {
 *        // prevent user.count greater than 10
 *        return true;
 *      }
 *      return cmp( prev, next );
 *    },
 *    afterChange: (newState) => console.log('users updated:', newState.users)
 *  });
 *  controls.set( 'foo' );
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
	options: Option<State, Acts>,
	selector: Sel
): ReturnType<Sel>;
export default function useCon<
	State extends DS,
>(
	initial: State,
	options?: never,
	selector?: never
): ReturnType<typeof defaultSelector<State, Record<never, never>>>;
export default function useCon<
	State extends DS,
	Sel extends Selector<State, Record<never, never>>,
>(
	initial: State,
	selector: Sel,
	_?: never
): ReturnType<Sel>;
export default function useCon<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Option<State, Acts>,
	_?: never
): ReturnType<typeof defaultSelector<State, Acts>>;
export default function useCon<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: unknown,
	selector?: unknown,
) {
	const _options = options && typeof options === 'object'
		? options as Option<State, Acts>
		: {} as Option<State, Acts>;
	const _selector = typeof options === 'function'
		? options as Selector<State, Acts>
		: typeof selector === 'function'
			? selector as Selector<State, Acts>
			: undefined;

	const selectorCallback = useSelectorCallback<State, Acts>(
		defaultSelector<State, Acts>,
		_selector,
	);
	const [
		state,
		setState,
	] = useState(
		() => {
			const conProps = createCon( initial, _options, );
			function updateStateIfChanged<T,>( operation: () => T, ): T {
				const oldHistory = conProps.get();
				const results = operation();
				const newHistory = conProps.get();

				if ( oldHistory !== newHistory ) {
					setState( selectorCallback( {
						...propsConActs.get(),
						...propsConActs,
					}, ), );
				}

				return results;
			}

			const wm = new WeakMap();
			const conActProps = {
				...conProps,
				currySet( ...args: Parameters<typeof conProps.currySet> ) {
					const curried = conProps.currySet( ...args, );
					const wmFn = wm.get( curried, );
					if ( typeof wmFn === 'function' ) {
						return wmFn;
					}

					const curriedSet = ( nextValue: Parameters<typeof curried>[0], ) => updateStateIfChanged( () => curried( nextValue, ), );
					wm.set( curried, curriedSet, );
					return curriedSet;
				},
				getDraft( ...args: Parameters<typeof conProps.getDraft> ) {
					const [
						draft,
						_finalize,
					] = conProps.getDraft( ...args, );

					function finalize() {
						return updateStateIfChanged( () => _finalize(), );
					}

					return [
						draft,
						finalize,
					];
				},
				reset() {
					return updateStateIfChanged( () => conProps.reset(), );
				},
				set( ...args: Parameters<typeof conProps.set> ) {
					return updateStateIfChanged( () => conProps.set( ...args, ), );
				},
				setWrap( ...args: Parameters<typeof conProps.setWrap> ) {
					const wrapped = conProps.setWrap( ...args, );
					return ( ...wrapProps: unknown[] ) => updateStateIfChanged( () => wrapped( ...wrapProps, ), );
				},
			} as typeof conProps;
			const propsConActs = createConActs( conActProps, _options?.acts, );

			return selectorCallback( {
				...propsConActs,
				...conActProps.get(),
			}, );
		},
	);

	return state;
}
