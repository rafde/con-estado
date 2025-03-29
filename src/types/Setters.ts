import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { Immutable, } from './Immutable';
import type { Merge, } from './Merge';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

type CallbackPathProps<
	S extends DS,
	SP extends StringPathToArray<NestedRecordKeys<S>>,
> = CallbackProps<S>
	& {
		stateProp: GetArrayPathValue<Draft<S>, SP>
		initialProp: GetArrayPathValue<Draft<S>, SP>
	}
	& {
		changesProp: GetArrayPathValue<S, SP> | undefined
		prevInitialProp: GetArrayPathValue<S, SP> | undefined
		prevProp: GetArrayPathValue<S, SP> | undefined
	};

type CallbackProps<
	S extends DS,
> = Immutable<Omit<History<S>, 'state' | 'initial'>> & Draft<HistoryState<S>>;

type Set<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
> = {
	/**
	 * Updates state and/or initial values directly with new values.
	 * Supports both complete state updates and targeted path updates.
	 *
	 * @template S - Base state type
	 * @template NS - History state type (includes both state and initial)
	 *
	 * @overload Completely replace `state` and/or `initial`
	 * @param nextState - Object containing new `state` and/or `initial` values
	 * @returns Updated history object
	 *
	 * @overload String path update
	 * @param statePath - Dot-bracket notation path to target state property (e.g. 'stateuser.profile.name')
	 * @param nextState - New value for the targeted property
	 * @returns Updated history object
	 *
	 * @overload Array path update
	 * @param statePath - Array path to target state property (e.g. ['state', 'user', 'profile', 'name'])
	 * @param nextState - New value for the targeted property
	 * @returns Updated history object
	 *
	 * @example Complete state update
	 * ```ts
	 * // Set both state and initial
	 * set({
	 *   state: { count: 5 },
	 *   initial: { count: 0 }
	 * });
	 *
	 * // Set only state
	 * set({
	 *   state: { count: 5 }
	 * });
	 *
	 * // Set only initial
	 * set({
	 *   initial: { count: 0 }
	 * });
	 * ```
	 *
	 * @example String path update
	 * ```ts
	 * // Update nested property
	 * set( 'state.user.profile.name', 'Alice');
	 * set( 'initial.user.profile.name', 'Alice');
	 *
	 * // Update array item
	 * set( 'state.items[0].price', 29.99);
	 * set( 'initial.items[0].price', 29.99);
	 * ```
	 *
	 * @example Array path update
	 * ```ts
	 * // Update nested property
	 * set( [ 'state', 'user', 'profile', 'name' ], 'Alice');
	 * set( [ 'initial', 'user', 'profile', 'name' ], 'Alice');
	 *
	 * // Update array item
	 * set( [ 'state', 'items', 0, 'price' ], 29.99);
	 * set( [ 'initial', 'items', 0, 'price' ], 29.99);
	 * ```
	 *
	 * @remarks
	 * - Direct value updates (no mutation callbacks like in commit/wrap)
	 * - Path updates affect both state and initial values
	 * - Supports negative array indices (e.g. 'state.items[-1]' for last item)
	 * - Maintains immutable history tracking
	 * - Type-safe for all update patterns
	 *
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link Commit.commit commit} For mutation-based updates
	 * @see {@link Merge.merge merge} For deep merging updates
	 * @see {@link Wrap.wrap wrap} For reusable parameterized updates
	 */
	set(
		nextState: {
			state: S
			initial: S
		}
		| {
			state: S
			initial?: S
		}
		| {
			state?: S
			initial: S
		}
	): History<S>

	set<
		SP extends NestedRecordKeys<NS>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, StringPathToArray<SP>>,
	): History<S>

	set<
		SP extends StringPathToArray<NestedRecordKeys<NS>>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, SP>,
	): History<S>
};

type Commit<
	S extends DS,
> = {
	/**
	 * Enables atomic setting to both `state` and `initial` state simultaneously.
	 * Similar to wrap but executes immediately rather than returning a function.
	 *
	 * @template S - Base state type
	 * @template RK - Nested record keys type
	 *
	 * @overload Function-based commit
	 * @param nextState - Callback receiving mutable `state` and `initial`
	 * @returns Updated history object
	 *
	 * @overload Array path-based commit
	 * @param statePath - Array path to target state property
	 * @param nextState - Callback receiving targeted mutable state values
	 * @returns Updated history object
	 *
	 * @overload String path-based commit
	 * @param statePath - Dot-bracket notation path to target state property
	 * @param nextState - Callback receiving targeted mutable state values
	 * @returns Updated history object
	 *
	 * @example Function-based commit
	 * ```ts
	 * commit(({ state, initial }) => {
	 *   state.count = 5;
	 *   initial.count = 0;
	 * });
	 * ```
	 *
	 * @example Array path commit
	 * ```ts
	 * commit(['items', 0], ({ stateProp, initialProp }) => {
	 *   stateProp.price = 29.99;
	 *   initialProp.price = 19.99;
	 * });
	 * ```
	 *
	 * @example String path commit
	 * ```ts
	 * commit('users.active', ({ stateProp, initialProp }) => {
	 *   stateProp.lastLogin = Date.now();
	 *   initialProp.lastLogin = null;
	 * });
	 * ```
	 *
	 * @remarks
	 * - Provides atomic updates to both state and initial state
	 * - Maintains type safety across all update patterns
	 * - Path-based commits support both array and dot notation
	 * - Unlike wrap, executes immediately instead of returning a function
	 * - Useful for synchronous state initialization and resets
	 *
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link Merge.merge merge} For deep merging updates
	 * @see {@link Wrap.wrap wrap} For reusable parameterized updates
	 * @see {@link Set.set set} For direct value replacement
	 */
	commit(
		nextState: (
			props: CallbackProps<S>,
		) => void
	): History<S>

	commit<
		SP extends NestedRecordKeys<S>,
	>(
		statePath: SP,
		nextState: (
			props: CallbackPathProps<S, StringPathToArray<SP>>,
		) => void
	): History<S>

	commit<
		SP extends StringPathToArray<NestedRecordKeys<S>>,
	>(
		statePath: SP,
		nextState: (
			props: CallbackPathProps<S, SP>,
		) => void
	): History<S>
};

type Wrap<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	/**
	 * Enables creating reusable state update functions with parameterized behavior.
	 *
	 * @template S - Base state type
	 * @template RK - Nested record keys type
	 * @template A - Array of argument types for the wrapped function
	 * @template R - Return type of the wrapped function
	 *
	 * @overload Function-based wrapper
	 * @param nextState - Callback receiving mutable `state` and/or `initial`, and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @overload Array path-based wrapper
	 * @param statePath - Array path to target `state` and/or `initial` property
	 * @param nextState - Callback receiving targeted mutable `state` and/or `initial`, and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @overload String path-based wrapper
	 * @param statePath - Dot-bracket notation path to target `state` and/or `initial` property.
	 * @param nextState - Callback receiving targeted mutable `state` and/or `initial`, and additional arguments
	 * @returns Wrapped function accepting the specified arguments
	 *
	 * @example Function-based wrapper
	 * ```ts
	 * const updateCount = controls.wrap(
	 *   ({ state }, multiplier: number) => {
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
	 * const updateItem = controls.wrap(
	 *   ['items', 0],
	 *   ({ stateProp }, name: string, price: number) => {
	 *     stateProp.name = name;
	 *     stateProp.price = price;
	 *   }
	 * );
	 *
	 * updateItem('Book', 29.99);
	 * ```
	 *
	 * @example String path wrapper
	 * ```ts
	 * const updateUser = controls.wrap(
	 *   'users.active',
	 *   ({ stateProp }, name: string, age: number) => {
	 *     stateProp.name = name;
	 *     stateProp.age = age;
	 *   }
	 * );
	 *
	 * updateUser('Alice', 30);
	 * ```
	 *
	 * @example Async operations
	 * ```ts
	 * const fetchAndUpdateUser = controls.wrap(
	 *   async ({ state }, userId: string) => {
	 *     const user = await fetchUser(userId);
	 *     state.users[userId] = user;
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
	 * - Path-based wrappers support both array and dot-bracket notation
	 * - Useful for creating reusable parameterized state updates
	 *
	 * @throws {Error} When trying to access non-object/array properties with dot-bracket notation
	 * @throws {Error} When path has out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link Set.set set} For direct value replacement
	 * @see {@link Commit.commit commit} For mutation-based updates
	 * @see {@link Merge.merge merge} For deep merging updates
	 */
	wrap<
		A extends unknown[],
		R = unknown,
	>(
		nextState: (
			props: CallbackProps<S>,
			...args: A
		) => R
	): ( ...args: A ) => R

	wrap<
		SP extends StringPathToArray<RK>,
		A extends unknown[],
		R = unknown,
	>(
		statePath: SP,
		nextState: (
			(
				props: CallbackPathProps<S, SP>,
				...args: A
			) => R
		),
	): ( ...args: A ) => R

	wrap<
		SP extends NestedRecordKeys<S>,
		A extends unknown[],
		R = unknown,
	>(
		statePath: SP,
		nextState: (
			(
				props: CallbackPathProps<S, StringPathToArray<SP>>,
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
& Commit<S>
& Merge<S>
& Set<S>
& Wrap<S>;
