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
	 */
	useSelector(): ReturnType<DefaultSelector<S, AR, UseSelectorProp<S, AR>>>
	/**
	 * A function that returns a derived value from the current state.
	 * @overload
	 *
	 * @typeParam {Selector} select - A selector `function` that returns a derived value
	 * @returns The derived value returned by the selector function.
	 */
	useSelector<Sel extends Selector<S, AR, UseSelectorProp<S, AR>>, >( select: Sel ): ReturnType<Sel>
};
