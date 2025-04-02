import type { ActRecord, } from './ActRecord';
import type { CreateConSubscribe, } from './CreateConSubscribe';
import type { DefaultSelector, } from './DefaultSelector';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { Selector, } from './Selector';
import type { SelectorProps, } from './SelectorProps';
import type { StringPathToArray, } from './StringPathToArray';

/**
 * Return type for a store creation function that combines state controls with selector functionality.
 *
 * @template S - The state type
 * @template AR - Action record type
 * @template SP - Selector props type
 * @template Sel - Selector type extending base Selector
 */
export type CreateConStoreReturnType<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
	Sel extends Selector<S, AR, SP> = DefaultSelector<S, AR, SP>,
> = CreateConSubscribe<S, AR, SelectorProps<S, AR, SP>> & {
	/**
	 * Default selector that returns the full state and control methods.
	 * Use this when you need access to the complete state tree and all controls.
	 *
	 * @returns Full state and control methods
	 *
	 * @example
	 * ```ts
	 * const [state, { set, merge, acts }] = useConSelector()
	 * ```
	 */
	(): ReturnType<Sel>

	/**
	 * Path-based selector for accessing nested values in the store's state or controls.
	 * Provides type-safe access to deeply nested properties using dot notation.
	 *
	 * @param select - Dot notation path to the desired value
	 * @returns The value at the specified path
	 *
	 * @example
	 * ```ts
	 * // Access nested state
	 * const userName = useConSelector('state.user.name')
	 * const isActive = useConSelector('state.user.settings.active')
	 *
	 * // Access control methods
	 * const setUser = useConSelector('set')
	 * const mergeSettings = useConSelector('merge')
	 *
	 * // Access actions
	 * const updateUser = useConSelector('acts.updateUser')
	 * ```
	 */
	<A extends NestedRecordKeys<CreateConSubscribe<S, AR, SP>>,>(
		select: A
	): GetArrayPathValue<
		CreateConSubscribe<S, AR, SP>,
		StringPathToArray<A>
	>

	/**
	 * History-based selector for accessing previous state values and changes.
	 * Useful for tracking state changes and accessing historical values.
	 *
	 * @param select - Dot-bracket notation path to the history value
	 * @returns The historical value at the specified path
	 *
	 * @example
	 * ```ts
	 * // Access previous state
	 * const prevName = useConSelector('prev.user.name')
	 *
	 * // Access initial state
	 * const initialSettings = useConSelector('initial.settings')
	 *
	 * // Access changes
	 * const userChanges = useConSelector('changes.user')
	 * ```
	 */
	<K extends NestedRecordKeys<History<S>>,>(
		select: K
	): GetArrayPathValue<History<S>, StringPathToArray<K>>

	/**
	 * Custom selector for creating derived state and optimized renders.
	 * Only triggers re-renders when selected values change.
	 *
	 * @param select - Selector function that computes derived state
	 * @returns The computed result from the selector
	 *
	 * @remarks
	 * - If selector returns a function, it won't trigger re-renders on changes
	 * - Use for computing derived state or creating memoized values
	 * - Selector has access to full state and control methods
	 *
	 * @example
	 * ```ts
	 * // Compute derived values
	 * const stats = useConSelector(({ state }) => ({
	 *   total: state.todos.length,
	 *   active: state.todos.filter(t => !t.done).length,
	 *   completed: state.todos.filter(t => t.done).length
	 * }))
	 *
	 * // Create optimized updater (won't cause re-renders)
	 * const updateUser = useConSelector(({ wrap }) =>
	 *   wrap('user', ({ stateProp }, updates) => {
	 *     Object.assign(stateProp, updates)
	 *   })
	 * )
	 *
	 * // Combine multiple controls
	 * const todoControls = useConSelector(({ acts, wrap }) => ({
	 *   addTodo: acts.addTodo,
	 *   toggleTodo: wrap('todos', ({ stateProp }, id) => {
	 *     const todo = stateProp.find(t => t.id === id)
	 *     if (todo) todo.done = !todo.done
	 *   })
	 * }))
	 * ```
	 */
	<Sel extends Selector<S, AR, SP>,>(
		select: Sel
	): ReturnType<Sel>
};
