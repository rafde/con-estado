import { useState, } from 'react';
import createCon from './_internal/createCon';
import defaultSelector, { type DefaultSelector, } from './_internal/defaultSelector';
import isPlainObject from './_internal/isPlainObject';
import useSelectorCallback from './_internal/useSelectorCallback';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Initial, } from './types/Initial';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';
// @ts-expect-error -- here for tsdocs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Options as MutOptions, } from 'mutative';
// @ts-expect-error -- here for tsdocs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OptionAfterChange, } from './types/OptionAfterChange';
// @ts-expect-error -- here for tsdocs
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OptionTransform, } from './types/OptionTransform';

/**
 * A React hook for managing state with history tracking and actions.
 *
 * @template {DS} S
 *
 * @param {Initial<S>} initial - The initial state object or `function` that returns the initial state object
 * @param {Option | Selector} [options] - Configuration options or custom state selector
 * @param {CreateActs} [options.acts] - A `function` to create a Record of actions `function`s that can be sync or async.
 * @param {OptionAfterChange} [options.afterChange] - Async callback after state changes
 * @param {MutOptions} [options.mutOptions] - Mutative options. {enablePatches: true} not supported
 * @param {OptionTransform} [options.transform] - `function` to transform the `state` and/or `initial` properties before it is set/reset
 * @param {Selector} [selector=DefaultSelector] - Custom state selector function that lets you shape what is returned.
 *
 * @returns {ReturnType<Selector<DS, ActRecord>> | ReturnType<DefaultSelector<DS, ActRecord>>}
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
 *  set( ({draft}) => {
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
	initial: Initial<S>,
	options: Option<S, A>,
	selector: Sel
): ReturnType<Sel>;
export default function useCon<
	S extends DS,
	AR extends ActRecord = Record<never, never>,
>(
	initial: Initial<S>,
	options?: Option<S, AR>,
	_?: never
): ReturnType<DefaultSelector<S, AR>>;
export default function useCon<
	S extends DS,
	Sel extends Selector<S, Record<never, never>>,
>(
	initial: Initial<S>,
	selector: Sel,
	_?: never
): ReturnType<Sel>;
export default function useCon<
	S extends DS,
	AR extends ActRecord,
>(
	initial: Initial<S>,
	options?: unknown,
	selector?: unknown,
) {
	const [
		opts,
		sel,
	] = isPlainObject( options, )
		? [options as Option<S, AR>, selector as Selector<S, AR> | undefined,]
		: [{} as Option<S, AR>, options as Selector<S, AR> | undefined,];

	const selectorCallback = useSelectorCallback<S, AR>(
		defaultSelector<S, AR>,
		sel,
	);
	const [
		state,
		setState,
	] = useState(
		() => {
			const conProps = createCon(
				typeof initial === 'function' ? initial() : initial,
				{
					...opts,
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
