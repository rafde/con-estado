import type { ActRecord, } from './ActRecord';
import type { DefaultSelector, } from './DefaultSelector';
import type { DS, } from './DS';
import type { Selector, } from './Selector';

export type UseSelectorProp<
	S extends DS,
	AR extends ActRecord,
> = {
	/**
	 * A function that returns a tuple containing the current state and selector props.
	 * @overload
	 *
	 * @template S - The state type
	 * @template AR - Action record type
	 * @template DefaultSelector - The default selector type
	 *
	 * @returns Tuple containing the current state and selector props.
	 *
	 * @remarks
	 * **TIP**: If your `selector` return value is/has a `function`, function will not be seen as a change to
	 * trigger re-render. This is a precaution to prevent unnecessary re-renders since all dynamic functions create a new reference.
	 * If you need to conditional return a `function`, it's better if you make a `function` that can handle your condition.
	 *
	 * example
	 *
	 * ```ts
	 * // Won't re-render
	 * const setCount = useCon(
	 *   initialState,
	 *   controls => controls.state.count < 10 ? controls.wrap('count') : () => {}
	 * );
	 *
	 * // Won't re-render, but it will do something.
	 * const setCount = useCon( initialState, controls => (value) => {
	 *   controls.state.count < 10 ? controls.set('count', value) : undefined
	 * });
	 * ```
	 *
	 * ```ts
	 * // This will re-render when `controls.state.count` value is updated
	 * const setCount = useCon( initialState, controls => ({
	 *   count: controls.state.count,
	 *   setCount: controls.state.count < 10 ? controls.wrap('count') : () => {}
	 * }));
	 * ```
	 */
	useSelector(): ReturnType<DefaultSelector<S, AR, UseSelectorProp<S, AR>>>
	/**
	 * A function that returns a derived value from the current state.
	 * @overload
	 *
	 * @typeParam {Selector} select - A selector `function` that returns a derived value
	 * @returns The derived value returned by the selector function.
	 *
	 * @remarks
	 * **TIP**: If your `selector` return value is/has a `function`, function will not be seen as a change to
	 * trigger re-render. This is a precaution to prevent unnecessary re-renders since all dynamic functions create a new reference.
	 * If you need to conditional return a `function`, it's better if you make a `function` that can handle your condition.
	 *
	 * example
	 *
	 * ```ts
	 * // Won't re-render
	 * const setCount = useCon(
	 *   initialState,
	 *   controls => controls.state.count < 10 ? controls.wrap('count') : () => {}
	 * );
	 *
	 * // Won't re-render, but it will do something.
	 * const setCount = useCon( initialState, controls => (value) => {
	 *   controls.state.count < 10 ? controls.set('count', value) : undefined
	 * });
	 * ```
	 *
	 * ```ts
	 * // This will re-render when `controls.state.count` value is updated
	 * const setCount = useCon( initialState, controls => ({
	 *   count: controls.state.count,
	 *   setCount: controls.state.count < 10 ? controls.wrap('count') : () => {}
	 * }));
	 * ```
	 */
	useSelector<Sel extends Selector<S, AR, UseSelectorProp<S, AR>>, >( select: Sel ): ReturnType<Sel>
};
