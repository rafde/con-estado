import type { ActRecord, } from './ActRecord';
import type { CreateConSubscribe, } from './CreateConSubscribe';
import type { DefaultSelector, } from './DefaultSelector';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { Selector, } from './Selector';
import type { StringPathToArray, } from './StringPathToArray';

export type UseSelectorProp<
	S extends DS,
	AR extends ActRecord,
> = {
	/**
	 * Hook for selecting and subscribing to state changes.
	 * Returns the entire state and controls when called with no arguments.
	 *
	 * @returns Default selector return value containing state and controls
	 *
	 * @example
	 * ```typescript
	 * // Get full state and controls
	 * const [state, controls] = useSelector();
	 * ```
	 */
	useSelector(): ReturnType<DefaultSelector<S, AR, UseSelectorProp<S, AR>>>

	/**
	 * Hook for selecting specific parts of state using a custom selector function.
	 * Only triggers re-renders when selected values change.
	 *
	 * @param select - Custom selector function to transform state
	 * @returns The transformed state based on selector
	 *
	 * @remarks
	 * If your selector returns a function, it won't trigger re-renders on reference changes.
	 * This is intentional to prevent unnecessary re-renders from dynamic function creation.
	 *
	 * @example
	 * ```typescript
	 * // Select specific state values
	 * const userData = useSelector(({ state }) => ({
	 *   name: state.user.name,
	 *   email: state.user.email
	 * }));
	 *
	 * // Select with computed values
	 * const todoStats = useSelector(({ state }) => ({
	 *   total: state.todos.length,
	 *   completed: state.todos.filter(t => t.completed).length
	 * }));
	 *
	 * // Function return (won't cause re-renders)
	 * const setCount = useSelector(controls =>
	 *   controls.state.count < 10
	 *     ? controls.wrap('count')
	 *     : () => {}
	 * );
	 * ```
	 */
	useSelector<Sel extends Selector<S, AR, UseSelectorProp<S, AR>>,>(
		select: Sel
	): ReturnType<Sel>

	/**
	 * Hook for selecting nested state values using dot-bracket notation path.
	 * Provides type-safe access to nested state properties.
	 *
	 * @param select - Dot notation path to nested state value
	 * @returns The value at the specified path
	 *
	 * @example
	 * ```typescript
	 * // Select nested state value
	 * const theme = useSelector('state.user.preferences.theme');
	 *
	 * // Select from state history
	 * const prevValue = useSelector('prev.user.name');
	 * const initialValue = useSelector('initial.user.name');
	 * ```
	 */
	useSelector<K extends NestedRecordKeys<History<S>>,>(
		select: K
	): GetArrayPathValue<History<S>, StringPathToArray<K>>

	/**
	 * Hook for selecting control functions and actions using dot notation path.
	 * Provides type-safe access to control functions and defined actions.
	 *
	 * @param select - Dot notation path to control function or action
	 * @returns The function at the specified path
	 *
	 * @example
	 * ```typescript
	 * // Select control functions
	 * const set = useSelector('set');
	 * const merge = useSelector('merge');
	 *
	 * // Select defined actions
	 * const updateUser = useSelector('acts.updateUser');
	 * const resetForm = useSelector('acts.resetForm');
	 * ```
	 */
	useSelector<A extends NestedRecordKeys<
		CreateConSubscribe<S, AR, Record<never, never>>
	>,>(
		select: A
	): GetArrayPathValue<
		CreateConSubscribe<S, AR, Record<never, never>>,
		StringPathToArray<A>
	>
};
