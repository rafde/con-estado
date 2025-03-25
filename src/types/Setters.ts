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
	 * Updates state history with immutable tracking of changes. Supports multiple update patterns:
	 * - Complete state object replacement
	 * - Direct mutations via callback
	 * - Path-based updates (dot notation or array paths)
	 *
	 * @template S - Base state type
	 * @template NS - Next state type (must extend HistoryState<S>)
	 *
	 * @overload Updates entire history state
	 * @param nextState - Complete state object extending current state
	 * @returns Updated history object
	 *
	 * @overload Updates via mutation callback
	 * @param nextState - Callback receiving draft for mutations
	 * @returns Updated history object
	 *
	 * @overload Updates via dot notation path
	 * @param statePath - Dot notation path (e.g. 'state.user.name')
	 * @param nextState - New value or mutation callback
	 * @returns Updated history object
	 *
	 * @overload Updates via array path
	 * @param statePath - Array path (e.g. ['state', 'items', 0])
	 * @param nextState - New value or mutation callback
	 * @returns Updated history object
	 *
	 * @example Complete state update
	 * ```ts
	 * setHistory({
	 *   state: { count: 5 },
	 *   initial: { count: 0 }
	 * });
	 * ```
	 *
	 * @example Mutation callback
	 * ```ts
	 * setHistory(({ historyDraft }) => {
	 *   historyDraft.state.count++;
	 *   historyDraft.initial = { count: 0 };
	 * });
	 * ```
	 *
	 * @example Dot notation path
	 * ```ts
	 * // Direct value
	 * setHistory('initial.user.name', 'Alice');
	 *
	 * // Mutation callback
	 * setHistory('initial.items', ({ draft }) => {
	 *   draft.push({ id: 'new' });
	 * });
	 * ```
	 *
	 * @example Array path
	 * ```ts
	 * // Direct value
	 * setHistory(['initial', 'items', 0], { id: 123 });
	 *
	 * // Mutation callback
	 * setHistory(['initial', 'users', 1], ({ draft }) => {
	 *   draft.active = true;
	 * });
	 * ```
	 *
	 * @remarks
	 * - All updates maintain immutable history tracking
	 * - Array paths require numeric indices (not string numbers)
	 * - Dot notation paths must escape dots in property names
	 * - When updating primitives via callback, must use historyDraft
	 * - Supports both state and initial value updates
	 * - Maintains type safety across all update patterns
	 *
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link HistoryState} For state structure
	 * @see {@link CallbackHistoryDraftProps} For callback parameters
	 * @see {@link ArrayPathProps} For path-based callback parameters
	 */
	setHistory(
		nextState: NS
	): History<S>

	setHistory(
		nextState: (
			props: CallbackHistoryDraftProps<S>,
		) => void
	): History<S>

	setHistory<
		SP extends NestedRecordKeys<NS>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, StringPathToArray<SP>>
	): History<S>

	setHistory<
		SP extends NestedRecordKeys<NS>,
	>(
		statePath: SP,
		nextState: (
			props: ArrayPathProps<S, NS, StringPathToArray<SP>>
		) => void
	): History<S>

	setHistory<
		SP extends StringPathToArray<NestedRecordKeys<NS>>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, SP>,
	): History<S>

	setHistory<
		SP extends StringPathToArray<NestedRecordKeys<NS>>,
	>(
		statePath: SP,
		nextState: (
			props: ArrayPathProps<S, NS, SP>
		) => void
	): History<S>
};

type SetHistoryWrap<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	/**
	 * Creates a wrapped version of setHistory that accepts additional arguments.
	 * Enables creating reusable state update functions with parameterized behavior.
	 *
	 * @template S - Base state type
	 * @template NS - Next state type (must extend HistoryState<S>)
	 * @template RK - Nested record keys type
	 * @template A - Array of argument types for the wrapped function
	 * @template R - Return type of the wrapped function
	 *
	 * @overload Function-based wrapper
	 * @param nextState - Callback receiving history draft and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @overload Array path-based wrapper
	 * @param statePath - Array path to target state property
	 * @param nextState - Callback receiving targeted draft and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @overload String path-based wrapper
	 * @param statePath - Dot notation path to target state property
	 * @param nextState - Callback receiving targeted draft and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @example Function-based wrapper
	 * ```ts
	 * const updateCount = controls.setHistoryWrap(
	 *   ({ historyDraft }, multiplier: number) => {
	 *     historyDraft.state.count *= multiplier;
	 *   }
	 * );
	 *
	 * updateCount(2); // Doubles count
	 * updateCount(0.5); // Halves count
	 * ```
	 *
	 * @example Array path wrapper
	 * ```ts
	 * const updateItem = controls.setHistoryWrap(
	 *   ['initial', 'items', 0],
	 *   ({ draft }, name: string, price: number) => {
	 *     draft.name = name;
	 *     draft.price = price;
	 *   }
	 * );
	 *
	 * updateItem('Book', 29.99);
	 * ```
	 *
	 * @example String path wrapper
	 * ```ts
	 * const updateUser = controls.setHistoryWrap(
	 *   'initial.users.active',
	 *   ({ draft }, name: string, age: number) => {
	 *     draft.name = name;
	 *     draft.age = age;
	 *   }
	 * );
	 *
	 * updateUser('Alice', 30);
	 * ```
	 *
	 * @remarks
	 * - Supports async operations with Promise return values
	 * - Maintains type safety for arguments and return values
	 * - Cannot return mutable draft objects
	 * - Path-based wrappers support both array and dot notation
	 * - Useful for creating reusable parameterized state updates
	 *
	 * @throws {Error} When returning mutable draft objects
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link CallbackHistoryDraftProps} For function wrapper parameters
	 * @see {@link ArrayPathProps} For path-based wrapper parameters
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
	 * Updates the current state while maintaining history tracking. Supports multiple update patterns:
	 * - Complete state object replacement
	 * - Direct mutations via callback
	 * - Path-based updates (dot notation or array paths)
	 *
	 * @template S - Base state type
	 *
	 * @overload Updates entire state
	 * @param nextState - Complete state object extending current state
	 * @returns Updated history object
	 *
	 * @overload Updates via mutation callback
	 * @param nextState - Callback receiving draft for mutations
	 * @returns Updated history object
	 *
	 * @overload Updates via dot notation path
	 * @param statePath - Dot notation path (e.g. 'users.profile.name')
	 * @param nextState - New value or mutation callback
	 * @returns Updated history object
	 *
	 * @overload Updates via array path
	 * @param statePath - Array path (e.g. ['users', 0, 'active'])
	 * @param nextState - New value or mutation callback
	 * @returns Updated history object
	 *
	 * @example Complete state update
	 * ```ts
	 * set({
	 *   count: 5,
	 *   user: { name: 'Alice' }
	 * });
	 * ```
	 *
	 * @example Mutation callback
	 * ```ts
	 * set(({ draft }) => {
	 *   draft.count++;
	 *   draft.user.lastLogin = Date.now();
	 * });
	 * ```
	 *
	 * @example Dot notation path
	 * ```ts
	 * // Direct value
	 * set('user.profile.name', 'Alice');
	 *
	 * // Mutation callback
	 * set('items', ({ draft }) => {
	 *   draft.push({ id: 'new' });
	 * });
	 * ```
	 *
	 * @example Array path
	 * ```ts
	 * // Direct value
	 * set(['items', 0], { id: 123 });
	 *
	 * // Mutation callback
	 * set(['users', 1], ({ draft }) => {
	 *   draft.active = true;
	 * });
	 * ```
	 *
	 * @remarks
	 * - All updates maintain immutable state tracking
	 * - Array paths require numeric indices (not string numbers)
	 * - Dot notation paths must escape dots in property names
	 * - When updating primitives via callback, must use draft
	 * - Maintains type safety across all update patterns
	 * - Unlike setHistory, only updates current state (not initial)
	 *
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link CallbackDraftProps} For callback parameters
	 * @see {@link ArrayPathProps} For path-based callback parameters
	 */
	set(
		nextState: S
	): History<S>

	set(
		nextState: (
			props: CallbackDraftProps<S>,
		) => void
	): History<S>

	set<
		SP extends NestedRecordKeys<S>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<S, StringPathToArray<SP>>,
	): History<S>

	set<
		SP extends NestedRecordKeys<S>,
	>(
		statePath: SP,
		nextState: (
			props: ArrayPathProps<S, S, StringPathToArray<SP>>
		) => void
	): History<S>

	set<
		SP extends StringPathToArray<NestedRecordKeys<S>>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<S, SP>,
	): History<S>

	set<
		SP extends StringPathToArray<NestedRecordKeys<S>>,
	>(
		statePath: SP,
		nextState: (
			props: ArrayPathProps<S, S, SP>
		) => void
	): History<S>
};

type SetWrap<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	/**
	 * Creates a wrapped version of set that accepts additional arguments.
	 * Enables creating reusable state update functions with parameterized behavior.
	 * Unlike setHistoryWrap, only updates current state (not initial).
	 *
	 * @template S - Base state type
	 * @template RK - Nested record keys type
	 * @template A - Array of argument types for the wrapped function
	 * @template R - Return type of the wrapped function
	 *
	 * @overload Function-based wrapper
	 * @param nextState - Callback receiving draft and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @overload Array path-based wrapper
	 * @param statePath - Array path to target state property
	 * @param nextState - Callback receiving targeted draft and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @overload String path-based wrapper
	 * @param statePath - Dot notation path to target state property
	 * @param nextState - Callback receiving targeted draft and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @example Function-based wrapper
	 * ```ts
	 * const updateCount = controls.setWrap(
	 *   ({ draft }, multiplier: number) => {
	 *     draft.count *= multiplier;
	 *   }
	 * );
	 *
	 * updateCount(2); // Doubles count
	 * updateCount(0.5); // Halves count
	 * ```
	 *
	 * @example Array path wrapper
	 * ```ts
	 * const updateItem = controls.setWrap(
	 *   ['items', 0],
	 *   ({ draft }, name: string, price: number) => {
	 *     draft.name = name;
	 *     draft.price = price;
	 *   }
	 * );
	 *
	 * updateItem('Book', 29.99);
	 * ```
	 *
	 * @example String path wrapper
	 * ```ts
	 * const updateUser = controls.setWrap(
	 *   'users.active',
	 *   ({ draft }, name: string, age: number) => {
	 *     draft.name = name;
	 *     draft.age = age;
	 *   }
	 * );
	 *
	 * updateUser('Alice', 30);
	 * ```
	 *
	 * @example Async operations
	 * ```ts
	 * const fetchAndUpdateUser = controls.setWrap(
	 *   async ({ draft }, userId: string) => {
	 *     const user = await fetchUser(userId);
	 *     draft.users[userId] = user;
	 *     return user;
	 *   }
	 * );
	 *
	 * await fetchAndUpdateUser('123');
	 * ```
	 *
	 * @remarks
	 * - Supports async operations with Promise return values
	 * - Maintains type safety for arguments and return values
	 * - Cannot return mutable draft objects
	 * - Path-based wrappers support both array and dot notation
	 * - Useful for creating reusable parameterized state updates
	 * - Only updates current state, not initial state
	 *
	 * @throws {Error} When returning mutable draft objects
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link CallbackDraftProps} For function wrapper parameters
	 * @see {@link ArrayPathProps} For path-based wrapper parameters
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
