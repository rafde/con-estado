import { useMemo, } from 'react';
import defaultSelector from './_internal/defaultSelector';
import getSnapshotSymbol from './_internal/getSnapshotSymbol';
import isPlainObject from './_internal/isPlainObject';
import { createConStore, } from './createConStore';
import type { ActRecord, } from './types/ActRecord';
import type { DefaultSelector, } from './types/DefaultSelector';
import type { DS, } from './types/DS';
import type { Initial, } from './types/Initial';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Options as MutOptions, } from 'mutative';
import type { SelectorProps, } from './types/SelectorProps';
import type { UseSelectorProp, } from './types/UseSelectorProp';

/**
 * React hook for managing local state with history tracking and actions.
 *
 * @typeParam S - The {@link DS data structure (DS)} that can be used.
 * @typeParam AR - {@link ActRecord Action record} that will return from {@link CreateActs options.acts}
 * @typeParam Sel - {@link Selector}
 *
 * @param {DS} initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param {Option} [options] - Configuration {@link Option options}.
 *
 * @param {Option.acts} [options.acts] - A {@link Option.acts function} that creates reusable actions for state management.
 * Takes control props (set, get, reset, etc.) and returns an object of action functions that can be asynchronous.
 *
 * @param {Option.afterChange} [options.afterChange] - A {@link Option.afterChange function} that runs after state changes are dispatched.
 * Receives the immutable history object containing the current state, changes, and previous states.
 * Can be async and return a Promise or void.
 *
 * @param {MutOptions} [options.mutOptions] - {@link MutOptions} Configuration options for the Mutative library's state updates.
 * Controls how drafts are created and modified. Supports all Mutative options except `enablePatches`.
 * See {@link https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options Mutative Options}
 *
 * @param {Option.transform} [options.transform] - A {@link Option.transform function} to transform state before it's updated.
 * Receives a mutable draft of both state and initial values, allowing you to modify them before changes are applied.
 * Called during set and reset operations with the corresponding action type.
 *
 * @param {Selector} [selector=DefaultSelector] - A {@link Selector function} to customize the shape of the returned state.
 * By {@link DefaultSelector default}, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @returns Returns state and controls based on the {@link Selector}.
 * - By {@link DefaultSelector default}, returns `[state, controls]`
 */
export function useCon<
	S extends DS,
	AR extends ActRecord,
	US extends { useSelector: UseSelectorProp<S, AR> },
	Sel extends Selector<S, AR, US> = DefaultSelector<S, AR, US>,
>(
	initial: Initial<S>,
	options?: Option<S, AR>,
	selector?: Sel
): ReturnType<Sel>;
/**
 * React hook for managing local state with history tracking and actions.
 *
 * @typeParam S - The {@link DS data structure (DS)} that can be used.
 * @typeParam Sel - {@link Selector}
 *
 * @param {DS} initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param {Selector} selector - {@link Selector} A function to customize the shape of the returned state.
 * By default, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @example
 * `selector` example
 * ```ts
 * // Default selector usage: [state, controls]
 * const [state, controls] = useCon({ count: 0 });
 *
 * // Custom selector usage
 * const { count, increment } = useCon(
 *   { count: 0 },
 *   // Custom selector
 *   ({ state, currySet }) => ({
 *     count: state.count,
 *     increment: currySet(({draft}) => draft.count++ )
 *   })
 * );
 * ```
 *
 * @returns Return based on what the {@link Selector} returns.
 */
export function useCon<
	S extends DS,
	Sel extends Selector<S, Record<never, never>, { useSelector: UseSelectorProp<S, Record<never, never>> }>,
>(
	initial: Initial<S>,
	selector: Sel,
): ReturnType<Sel>;
export function useCon<
	S extends DS,
	AR extends ActRecord,
	US extends { useSelector: UseSelectorProp<S, AR> },
	Sel extends Selector<S, AR, US> = DefaultSelector<S, AR, US>,
>(
	initial: Initial<S>,
	options?: unknown,
	selector?: unknown,
) {
	const useSelector = useMemo(
		() => {
			const [
				opts,
				sel,
			] = isPlainObject( options, )
				? [options as Option<S, AR>, selector as Sel,]
				: [{} as Option<S, AR>, options as Sel,];
			const _useSelector = createConStore<S, AR, US, Sel>(
				initial,
				{
					...opts,
					[ getSnapshotSymbol ]: props => ( {
						...props,
						useSelector( sel: Parameters<typeof _useSelector>[0] = defaultSelector<S, AR, US>, ) {
							return _useSelector( sel, );
						},
					} as SelectorProps<S, AR, US> ),
				},
				sel,
			);

			return _useSelector;
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return useSelector();
}
