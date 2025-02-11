import { useState, } from 'react';

import createConBase from './_internal/createConBase';
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
 * @param {DS | () => DS} initial - The initial state object
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
	S extends DS,
	A extends ActRecord,
	Sel extends Selector<S, A>,
>(
	initial: S | ( () => S ),
	options: Option<S, A>,
	selector: Sel
): ReturnType<Sel>;
export default function useCon<
	S extends DS,
>(
	initial: S | ( () => S ),
	options?: never,
	selector?: never
): ReturnType<typeof defaultSelector<S, Record<never, never>>>;
export default function useCon<
	S extends DS,
	Sel extends Selector<S, Record<never, never>>,
>(
	initial: S | ( () => S ),
	selector: Sel,
	_?: never
): ReturnType<Sel>;
export default function useCon<
	S extends DS,
	AR extends ActRecord,
>(
	initial: S | ( () => S ),
	options?: Option<S, AR>,
	_?: never
): ReturnType<typeof defaultSelector<S, AR>>;
export default function useCon<
	S extends DS,
	AR extends ActRecord,
>(
	initial: S | ( () => S ),
	options?: unknown,
	selector?: unknown,
) {
	const _options = options && typeof options === 'object'
		? options as Option<S, AR>
		: {} as Option<S, AR>;
	const _selector = typeof options === 'function'
		? options as Selector<S, AR>
		: typeof selector === 'function'
			? selector as Selector<S, AR>
			: undefined;

	const selectorCallback = useSelectorCallback<S, AR>(
		defaultSelector<S, AR>,
		_selector,
	);
	const [
		state,
		setState,
	] = useState(
		() => {
			const conProps = createConBase(
				typeof initial === 'function' ? initial() : initial,
				{
					..._options,
					dispatcher() {
						setState( selectorCallback( {
							...conProps.get(),
							...conProps,
						}, ), );
					},
				},
			);

			return selectorCallback( {
				...conProps.get(),
				...conProps,
			}, );
		},
	);

	return state;
}
