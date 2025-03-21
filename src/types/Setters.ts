import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { Immutable, } from './Immutable';
import type { Merge, } from './Merge';
import type { MergeHistory, } from './MergeHistory';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

/**
 * Properties passed to callback functions when updating state through string path-based mutations.
 * Combines immutable history state with mutable drafts for property modifications.
 *
 * @template S The current state type
 * @template NS The next state type, extending history state or base state
 * @template SP Array path type for accessing nested properties
 * @template History<S> - The current history state (immutable)
 *
 * @typeParam {GetArrayPathValue<NS, SP> | undefined} changesProp - Changes made to the property
 * @typeParam {GetArrayPathValue<NS, SP>} initialProp - Initial value of the property
 * @typeParam {GetArrayPathValue<NS, SP> | undefined} - prevInitialProp - Previous initial value
 * @typeParam {GetArrayPathValue<NS, SP> | undefined} - prevProp Previous value
 * @typeParam {GetArrayPathValue<NS, SP>} stateProp - Current value
 * @typeParam {GetArrayPathValue<NS, SP>} historyDraft - Mutable historyDraft for modifications
 * @typeParam {Draft<HistoryState<S>>} historyDraft - Mutable historyDraft for history state
 */
type ArrayPathProps<
	S extends DS,
	NS extends HistoryState<S> | S,
	SP extends StringPathToArray<NestedRecordKeys<NS>>,
> = Immutable<History<S> & {
	changesProp: GetArrayPathValue<NS, SP> | undefined
	initialProp: GetArrayPathValue<NS, SP>
	prevInitialProp: GetArrayPathValue<NS, SP> | undefined
	prevProp: GetArrayPathValue<NS, SP> | undefined
	stateProp: GetArrayPathValue<NS, SP>
}> & {
	draft: GetArrayPathValue<Draft<NS>, SP>
	historyDraft: Draft<HistoryState<S>>
};

/**
 * Properties passed to callback functions when updating state history through historyDraft mutations.
 * Combines the current history state with a mutable historyDraft for making changes.
 *
 * @template S - The current state type
 * @template History<S> - The current history state (immutable)
 *
 * @typeParam Draft<HistoryState<S>> historyDraft - The current history state (immutable)
 */
type CallbackHistoryDraftProps<
	S extends DS,
> = History<S> & Readonly<{
	historyDraft: Draft<HistoryState<S>>
}>;

/**
 * Properties passed to callback functions when updating array elements through path-based mutations.
 * Combines immutable history state with mutable drafts for array element modifications.
 *
 * @template S - The current state type
 * @template NS - The next state type, extending history state or base state
 * @template SP - Array path type for accessing nested elements
 * @template CallbackHistoryDraftProps<S> - The current history state (immutable)
 *
 * @typeParam {Draft} historyDraft - The current state
 */
type CallbackDraftProps<
	S extends DS,
> = CallbackHistoryDraftProps<S> & Readonly<{
	draft: Draft<S>
}>;

type SetHistory<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
> = {
	/**
	 * Updates the `state` and/or `initial` with either a new state object or mutation callback
	 * Creates immutable history records while maintaining previous state versions
	 * @overload
	 *
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 *
	 * @property {NS | ((props: CallbackHistoryDraftProps<S>) => void)} nextState - Either:
	 *   - Complete new state object that extends current state type
	 *   - Mutation callback receiving historyDraft state props for direct modification
	 *
	 * @returns Updated {@link History<S> history} object
	 *
	 * @example
	 * ```ts
	 * // Replace entire state
	 * setHistory({
	 *    state: { count: 5, items: ['new'] },
	 *    initial: { count: 5, items: ['new'] },
	 * });
	 *```
	 * @example
	 * ```ts
	 * // Mutate historyDraft state
	 * setHistory(({ historyDraft }) => {
	 *    historyDraft.state.count++
	 *    historyDraft.initial.items.push('new-item')
	 * });
	 * ```
	 *
	 * @see {@link History} For detailed history structure
	 * @see {@link CallbackHistoryDraftProps} For historyDraft callback parameters
	 *
	 * @remarks
	 * This overload handles full state updates rather than path-specific modifications.
	 */
	setHistory(
		nextState: NS | ( (
			props: CallbackHistoryDraftProps<S>,
		) => void )
	): History<S>
	/**
	 * Specialized overload for updating state history at a specified dot notated string path with either a direct value or callback function.
	 * @overload
	 *
	 * @template SP - Dot-notation string path type representing nested state properties (e.g., 'state.user.profile.age', initial.user.post.0.title')
	 * @template RK - Runtime key type constraint for path validation
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 *
	 * @property statePath - Dot-notation string path to the state property to update
	 * @property nextState -
	 *   Either:
	 *   - Direct value to set at the specified path
	 *   - Callback function receiving string path to prop, allowing historyDraft mutations
	 *
	 * @returns Updated {@link History<S> history} object
	 *
	 * @example
	 * ```ts
	 * // Set direct value
	 * setHistory('state.user.age', 30);
	 * ```
	 * @example
	 * ```ts
	 * // Update via callback
	 * setHistory('state.cart.items', ({ historyDraft }) => {
	 *    historyDraft.push({ id: 123, quantity: 2 });
	 * });
	 * ```
	 *
	 * @see {@link History} For full history object structure
	 *
	 * @remarks
	 * - Requires explicit numeric indexes in path (e.g., 'state.items.0' not 'state.items.first')
	 * - Keys with dot in name require you to escape dot, e.g. `state.user\\.profile.age`
	 * - Path to non-array or non-object requires you to update through `props.historyDraft` because of how Proxy works
	 */
	setHistory<
		SP extends NestedRecordKeys<NS>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, StringPathToArray<SP>> | (
			(
				props: ArrayPathProps<S, NS, StringPathToArray<SP>>
			) => void
		),
	): History<S>
	/**
	 *
	 * Specialized overload for updates state history at a specified array of strings or numbers (for arrays) path with either a direct value or callback function.
	 * @overload
	 *
	 * @template SP - Array path type (e.g., ['state', 'items', '0'] or ['initial', 'users', '2', 'address'])
	 * @template RK - Runtime key constraints for array path validation
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 *
	 * @property {SP} statePath - Array path to the state property to update, can have dot notation, e.g. `['state', 'items', 0]` or `['initial', 'users', 2, 'address.name']`
	 * @property {GetArrayPathValue<NS, SP> | ((props: ArrayPathProps<S, NS, SP>) => void)} nextState - Either:
	 *   - Direct value to set at specified array index
	 *   - Callback function receiving array path to prop for historyDraft mutations
	 *
	 * @returns {History<S>} Updated history object with array changes tracked
	 *
	 * @example
	 * ```ts
	 * // Set array element by index
	 * setHistory(['state', 'items', 0], { id: 123 });
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Modify array element via callback
	 * setHistory(['state', 'users', 1, 'age'], (props) => {
	 *    props.historyDraft += 1;
	 * });
	 * ```
	 *
	 * @see {@link ArrayPathProps} For array element callback parameters
	 * @see {@link GetArrayPathValue} For array path value type resolution
	 *
	 * @remarks
	 * - Requires explicit numeric indexes in path (e.g., ['state', 'items', 0] not ['state', 'items', '0')
	 * - Path to non-array or non-object requires you to update through `props.historyDraft` because of how Proxy works
	 */
	setHistory<
		SP extends StringPathToArray<NestedRecordKeys<NS>>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, SP> | (
			(
				props: ArrayPathProps<S, NS, SP>
			) => void
		),
	): History<S>
};

type SetHistoryWrap<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	/**
	 * Creates a wrapped setHistory function that accepts additional arguments.
	 * Enables parameterized state updates through curried arguments
	 * @overload
	 *
	 * @template A - Type array for additional arguments
	 * @template S - Current state type
	 *
	 * @property {(props: CallbackHistoryDraftProps<S>, ...args: A) => void} nextState -
	 *   Callback function that:
	 *   - Receives historyDraft state props as first parameter
	 *   - Accepts additional parameters of type unknown
	 *   - Performs state mutations on historyDraft
	 *
	 * @returns Wrapped function that:
	 *   - Accepts parameters of type A
	 *   - Returns whatever the wrapper function returns
	 *
	 * @example
	 * ```ts
	 * // Create parameterized updater
	 * const updateWithFactor = controls.setHistoryWrap(
	 *   ({ historyDraft }, factor: number) => {
	 *      historyDraft.state.count *= factor
	 *   }
	 * );
	 *
	 * // Apply with arguments
	 * updateWithFactor(2); // Doubles count
	 * updateWithFactor(0.5); // Halves count
	 * ```
	 *
	 * @see {@link CallbackHistoryDraftProps} For historyDraft parameter details
	 *
	 * @remarks
	 * - Useful for creating reusable state modifiers with configurable parameters
	 * - Maintains full type safety for both historyDraft and additional arguments
	 */
	setHistoryWrap<
		A extends unknown[],
		R = unknown,
	>(
		nextState: (
			props: CallbackHistoryDraftProps<S>,
			...args: A
		) => R
	): ( ...args: A ) => R
	/**
	 * Creates a wrapped setHistory function for array paths with additional arguments.
	 * Enables parameterized array element updates through curried path and args
	 * @overload
	 *
	 * @template SP - Array path type (e.g., ['state', 'items', 0] or ['initial', 'users', 2, 'address'])
	 * @template A - Type array for additional arguments
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 * @template RK - Runtime key constraints
	 *
	 * @property {SP} statePath - Array path to target element (supports numeric indexes)
	 * @property {(props: ArrayPathProps<S, NS, SP>, ...args: A) => void} nextState -
	 *   Callback function that:
	 *   - Receives array element historyDraft props
	 *   - Accepts additional parameters of type A
	 *   - Mutates the specified array element
	 *
	 * @returns Function that:
	 *   - Accepts parameters of type A
	 *   - Returns whatever the wrapper function returns
	 *
	 * @example
	 * ```ts
	 * // Create parameterized array updater
	 * const updateItemPrice = controls.setHistoryWrap(
	 *   ['state', 'items', 0],
	 *   ({ historyDraft }, discount: number) => {
	 *      historyDraft.price *= (1 - discount)
	 *   }
	 * );
	 *
	 * // Apply with different discounts
	 * updateItemPrice(0.1); // 10% off
	 * updateItemPrice(0.2); // 20% off
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Nested array path with multiple parameters
	 * const updateUserScore = controls.setHistoryWrap(
	 *   ['state', 'users', 1, 'scores'],
	 *   ({ historyDraft }, subject: string, points: number) => {
	 *      historyDraft[subject] = points
	 *   }
	 * );
	 *
	 * updateUserScore('math', 95);
	 * ```
	 *
	 * @see {@link ArrayPathProps} For array element historyDraft details
	 * @see {@link GetArrayPathValue} For array path value resolution
	 *
	 * @remarks
	 * - Useful for creating reusable state modifiers with configurable parameters
	 * - Maintains full type safety for path, historyDraft, and arguments
	 */
	setHistoryWrap<
		SP extends StringPathToArray<RK>,
		A extends unknown[],
		R = unknown,
	>(
		statePath: SP,
		nextState: (
			(
				props: ArrayPathProps<S, NS, SP>,
				...args: A
			) => R
		),
	): ( ...args: A ) => R
	/**
	 * Creates a wrapped setHistory function for dot-notation string paths with additional arguments.
	 * Enables parameterized state updates through curried path and parameters
	 * @overload
	 *
	 * @template SP - Dot-notation string path type (e.g., 'items.0.price' or 'users.active.email')
	 * @template A - Type array for additional arguments
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 * @template RK - Runtime key constraints
	 *
	 * @param statePath - Dot-notation string path to target property
	 * @param nextState -
	 *   Callback function that:
	 *   - Receives path-specific historyDraft props
	 *   - Accepts additional parameters of type A
	 *   - Mutates the specified property
	 *
	 * @returns Function that:
	 *   - Accepts parameters of type A
	 *   - Returns whatever the wrapper function returns
	 *
	 * @example
	 * ```ts
	 * // Create percentage-based price updater
	 * const updatePrice = controls.setHistoryWrap(
	 *   'state.items.0.price',
	 *   ({ historyDraft }, percentage: number) => {
	 *      historyDraft *= (1 + percentage/100)
	 *   }
	 * );
	 *
	 * updatePrice(10); // +10%
	 * updatePrice(-5); // -5%
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Multi-parameter string path update
	 * const updateUserProfile = controls.setHistoryWrap(
	 *   'state.users.active',
	 *   ({ historyDraft }, name: string, age: number) => {
	 *      historyDraft.name = name
	 *      historyDraft.age = age
	 *   }
	 * );
	 *
	 * updateUserProfile('Alice', 32);
	 * ```
	 *
	 * @remarks
	 * - Handles escaped dots in path keys (e.g., 'user\\.profile.age')
	 * - Maintains full type safety for path, historyDraft, and arguments
	 */
	setHistoryWrap<
		SP extends RK,
		A extends unknown[],
		R = unknown,
	>(
		statePath: SP,
		nextState: (
			(
				props: ArrayPathProps<S, NS, StringPathToArray<SP>>,
				...args: A
			) => R
		),
	): ( ...args: A ) => R
};

type SetState<
	S extends DS,
> = {
	/**
	 * Updates state with either a new state object or mutation callback
	 * @overload
	 *
	 * @template S - Current state type
	 *
	 * @property {S | ((props: CallbackDraftProps<S>) => void)} nextState - Either:
	 *   - Complete new state object that extends current state type
	 *   - Mutation callback receiving historyDraft state props for direct modification
	 *
	 * @returns Updated {@link History<S> history} object
	 *
	 * @example
	 * ```ts
	 * // Replace entire state
	 * set({ count: 5, items: ['new'] });
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Mutate historyDraft state
	 * set(({ historyDraft }) => {
	 *   historyDraft.count++
	 *   historyDraft.items.push('new-item')
	 * });
	 * ```
	 *
	 * @see {@link History} For detailed history structure
	 * @see {@link CallbackDraftProps} For historyDraft callback parameters
	 *
	 * @remarks
	 * This overload handles state updates rather than path-specific modifications.
	 */
	set(
		nextState: S | ( (
			props: CallbackDraftProps<S>,
		) => void )
	): History<S>
	/**
	 * Specialized overload for updating state at a specified dot-notated string path with either a direct value or callback function.
	 * @overload
	 *
	 * @template SP - Dot-notation string path type representing nested state properties (e.g., 'user.profile.age', user.post.0.title')
	 * @template RK - Runtime key type constraint for path validation
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 *
	 * @property statePath - Dot-notation string path to the state property to update
	 * @property nextState -
	 *   Either:
	 *   - Direct value to set at the specified path
	 *   - Callback function receiving string path to prop, allowing historyDraft mutations
	 *
	 * @returns Updated {@link History<S> history} object
	 *
	 * @example
	 * ```ts
	 * // Set direct value
	 * set('user.age', 30);
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Update via callback
	 * set('cart.items', ({ historyDraft }) => {
	 *    historyDraft.push({ id: 123, quantity: 2 });
	 * });
	 * ```
	 *
	 * @see {@link History} For full history object structure
	 *
	 * @remarks
	 * - Requires explicit numeric indexes in path (e.g., 'items.0' not 'items.first')
	 * - Keys with dot in name require you to escape dot, e.g. `user\\.profile.age`
	 * - Path to non-array or non-object requires you to update through `props.historyDraft` because of how Proxy works
	 */
	set<
		SP extends NestedRecordKeys<S>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<S, StringPathToArray<SP>> | (
			(
				props: ArrayPathProps<S, S, StringPathToArray<SP>>
			) => void
		),
	): History<S>
	/**
	 *
	 * Specialized overload for updating state  at a specified array of strings or numbers (for arrays) path with either a direct value or callback function.
	 * @overload
	 *
	 * @template SP - Array path type (e.g., ['items', '0'] or ['users', '2', 'address'])
	 * @template RK - Runtime key constraints for array path validation
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 *
	 * @property {SP} statePath - Array path to the state property to update, can have dot notation, e.g. `['items', 0]` or `['users', 2, 'address.name']`
	 * @property {GetArrayPathValue<NS, SP> | ((props: ArrayPathProps<S, S, SP>) => void)} nextState - Either:
	 *   - Direct value to set at specified array index
	 *   - Callback function receiving array path to prop for historyDraft mutations
	 *
	 * @returns {History<S>} Updated history object with array changes tracked
	 *
	 * @example
	 * ```ts
	 * // Set array element by index
	 * set(['state', 'items', 0], { id: 123 });
	 * ```
	 *
	 * @example
	 * ```ts
	 * // Modify array element via callback
	 * set(['state', 'users', 1, 'age'], (props) => {
	 *    props.historyDraft += 1;
	 * });
	 * ```
	 *
	 * @see {@link ArrayPathProps} For array element callback parameters
	 * @see {@link GetArrayPathValue} For array path value type resolution
	 *
	 * @remarks
	 * - Requires explicit numeric indexes in path (e.g., ['items', 0] not ['items', '0')
	 * - Path to non-array or non-object requires you to update through `props.historyDraft` because of how Proxy works
	 */
	set<
		SP extends StringPathToArray<NestedRecordKeys<S>>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<S, SP> | (
			(
				props: ArrayPathProps<S, S, SP>
			) => void
		),
	): History<S>
};

type SetWrap<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	/**
	 * Creates a wrapped set function that accepts additional arguments.
	 * Enables parameterized state updates through curried arguments
	 * @overload
	 *
	 * @template A - Type array for additional arguments
	 * @template S - Current state type
	 *
	 * @property {(props: CallbackDraftProps<S>, ...args: A) => void} nextState -
	 *   Callback function that:
	 *   - Receives historyDraft state props as first parameter
	 *   - Accepts additional parameters of type unknown
	 *   - Performs state mutations on historyDraft
	 *
	 * @returns Wrapped function that:
	 *   - Accepts parameters of type A
	 *  - Returns whatever the wrapper function returns
	 *
	 * @example
	 * ```ts
	 * // Create parameterized updater
	 * const updateWithFactor = controls.setWrap(
	 *   ({ historyDraft }, factor: number) => {
	 *      historyDraft.count *= factor
	 *   }
	 * );
	 *
	 * // Apply with arguments
	 * updateWithFactor(2); // Doubles count
	 * updateWithFactor(0.5); // Halves count
	 *```

	 * @see {@link CallbackDraftProps} For historyDraft parameter details
	 *
	 * @remarks
	 * - Useful for creating reusable state modifiers with configurable parameters
	 * - Maintains full type safety for both historyDraft and additional arguments
	 */
	setWrap<
		A extends unknown[],
		R = unknown,
	>(
		nextState: (
			props: CallbackDraftProps<S>,
			...args: A
		) => R
	): ( ...args: A ) => R
	/**
	 * Creates a wrapped set function for array paths with additional arguments.
	 * Enables parameterized array element updates through curried path and args
	 * @overload
	 *
	 * @template SP - Array path type (e.g., ['items', 0] or ['users', 2, 'address'])
	 * @template A - Type array for additional arguments
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 * @template RK - Runtime key constraints
	 *
	 * @property {SP} statePath - Array path to target element (supports numeric indexes)
	 * @property {(props: ArrayPathProps<S, S, SP>, ...args: A) => void} nextState -
	 *   Callback function that:
	 *   - Receives array element historyDraft props
	 *   - Accepts additional parameters of type A
	 *   - Mutates the specified array element
	 *
	 * @returns Function that:
	 *   - Accepts parameters of type A
	 *   - Returns whatever the wrapper function returns
	 *
	 * @example
	 * ```ts
	 * // Create parameterized array updater
	 * const updateItemPrice = controls.setWrap(
	 *   ['state', 'items', 0],
	 *   ({ historyDraft }, discount: number) => {
	 *      historyDraft.price *= (1 - discount)
	 *   }
	 * );
	 *
	 * // Apply with different discounts
	 * updateItemPrice(0.1); // 10% off
	 * updateItemPrice(0.2); // 20% off
	 *```
	 *
	 * @example
	 * ```ts
	 * // Nested array path with multiple parameters
	 * const updateUserScore = controls.setWrap(
	 *   ['state', 'users', 1, 'scores'],
	 *   ({ historyDraft }, subject: string, points: number) => {
	 *      historyDraft[subject] = points
	 *   }
	 * );
	 *
	 * updateUserScore('math', 95);
	 *```

	 * @see {@link ArrayPathProps} For array element historyDraft details
	 * @see {@link GetArrayPathValue} For array path value resolution
	 *
	 * @remarks
	 * - Useful for creating reusable state modifiers with configurable parameters
	 * - Maintains full type safety for path, historyDraft, and arguments
	 */
	setWrap<
		SP extends StringPathToArray<RK>,
		A extends unknown[],
		R = unknown,
	>(
		statePath: SP,
		nextState: (
			(
				props: ArrayPathProps<S, S, SP>,
				...args: A
			) => R
		),
	): ( ...args: A ) => R
	/**
	 * Creates a wrapped set function for dot-notation string paths with additional arguments.
	 * Enables parameterized array element updates through curried path and args
	 * @overload
	 *
	 * @template SP - Dot-notation string path type (e.g., 'items.0` or 'users.2.address')
	 * @template A - Type array for additional arguments
	 * @template S - Current state type
	 * @template NS - Next state type (must extend S)
	 * @template RK - Runtime key constraints
	 *
	 * @property statePath - Dot-notation string path to target element (supports numeric indexes)
	 * @property nextState -
	 *   Callback function that:
	 *   - Receives array element historyDraft props
	 *   - Accepts additional parameters of type A
	 *   - Mutates the specified array element
	 *
	 * @returns Function that:
	 *   - Accepts parameters of type A
	 *  - Returns whatever the wrapper function returns
	 *
	 * @example
	 * ```ts
	 * // Create parameterized array updater
	 * const updateItemPrice = controls.setWrap(
	 *   'items.0',
	 *   ({ historyDraft }, discount: number) => {
	 *      historyDraft.price *= (1 - discount)
	 *   }
	 * );
	 *
	 * // Apply with different discounts
	 * updateItemPrice(0.1); // 10% off
	 * updateItemPrice(0.2); // 20% off
	 *```
	 *
	 * @example
	 * ```ts
	 * // Nested string path with multiple parameters
	 * const updateUserScore = controls.setWrap(
	 *   'users.1.scores',
	 *   ({ historyDraft }, subject: string, points: number) => {
	 *      historyDraft[subject] = points
	 *   }
	 * );
	 *
	 * updateUserScore('math', 95);
	 *```
	 *
	 * @remarks
	 * - Useful for creating reusable state modifiers with configurable parameters
	 * - Maintains full type safety for path, historyDraft, and arguments
	 */
	setWrap<
		SP extends NestedRecordKeys<S>,
		A extends unknown[],
		R = unknown,
	>(
		statePath: SP,
		nextState: (
			(
				props: ArrayPathProps<S, S, StringPathToArray<SP>>,
				...args: A
			) => R
		),
	): ( ...args: A ) => R
};

export type Setters<
	S extends DS,
> = {
	/**
	 * Resets the state to its initial value, clearing any history of changes.
	 * @template S - Current state type
	 * @returns {History<S>} The updated history object reflecting the reset state.
	 *
	 * @example
	 * ```ts
	 * const [
	 *   state,
	 *   { reset }
	 * ] = useCon( { count: 0 }, );
	 *
	 * reset();
	 * ```
	 *
	 * @remarks
	 * This method is useful for restoring the state to its original configuration,
	 * effectively discarding any modifications made since the initial state.
  	 */
	reset(): History<S>
}
& MergeHistory<S>
& Merge<S>
& SetHistory<S>
& SetHistoryWrap<S>
& SetState<S>
& SetWrap<S>;
