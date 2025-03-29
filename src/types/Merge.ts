import type { DeepPartial, } from './DeepPartial';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

export type Merge<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
> = {
	/**
	 * Deeply merges updates into `state` and/or `initial`.
	 * Supports both complete state merges and targeted path merges.
	 *
	 * @template S - Base state type
	 * @template NS - History state type (includes both state and initial)
	 *
	 * @overload Complete state merge
	 * @param nextState - Partial object containing state and/or initial updates to merge
	 * @returns Updated history object
	 *
	 * @overload String path merge
	 * @param statePath - Dot notation path to target state property (e.g. 'user.profile')
	 * @param nextState - Partial object to merge at the targeted path
	 * @returns Updated history object
	 *
	 * @overload Array path merge
	 * @param statePath - Array path to target state property (e.g. ['user', 'profile'])
	 * @param nextState - Partial object to merge at the targeted path
	 * @returns Updated history object
	 *
	 * @example Complete state merge
	 * ```ts
	 * // Merge updates into both state and initial
	 * merge({
	 *   state: {
	 *     user: { profile: { name: 'John' } }
	 *   },
	 *   initial: {
	 *     settings: { theme: 'dark' }
	 *   }
	 * });
	 * ```
	 *
	 * @example String path merge
	 * ```ts
	 * // Merge into nested object
	 * merge( 'user.profile', {
	 *   name: 'John',
	 *   age: 30
	 * });
	 *
	 * // Merge into array
	 * merge( 'posts[0]', {
	 *   title: 'Updated',
	 *   views: 100
	 * });
	 *
	 * // Merge with escaped special characters
	 * merge( 'path.user\\.name\\[0]', { value: 'John' } );
	 * ```
	 *
	 * @example Array path merge
	 * ```ts
	 * // Merge into nested object
	 * merge( [ 'user', 'profile' ], {
	 *   name: 'John',
	 *   age: 30
	 * });
	 *
	 * // Merge into array with negative index
	 * merge( [ 'posts', -1 ], {
	 *   title: 'Updated Last'
	 * });
	 * ```
	 *
	 * @example Array merging behavior
	 * ```ts
	 * // Sparse array updates
	 * merge('posts', [
	 *   undefined,           // Skip first element
	 *   { title: 'New' },   // Update second element
	 *   { status: 'draft' } // Update third element
	 * ]);
	 *
	 * // Empty array merge (no effect)
	 * merge('posts', []); // Does nothing
	 * ```
	 *
	 * @remarks
	 * - Performs deep merging of plain objects
	 * - Creates missing intermediate objects/arrays in paths
	 * - Non-plain objects/arrays replace instead of merge
	 * - Array merging requires sparse arrays to indicate updates
	 * - Empty array or plain object merges have no effect
	 * - Supports negative indices for arrays (must be in bounds)
	 * - Special characters in paths must be escaped in dot-bracket notation
	 * - Maintains type safety across all merge patterns
	 *
	 * @throws {Error} When trying to:
	 * - Access non-object/array properties with dot-bracket notation
	 * - Merge incompatible types (e.g., object into array)
	 * - Access out-of-bounds negative indices
	 *
	 * @see {@link History} For history object structure
	 * @see {@link Set.set set} For direct value replacement
	 * @see {@link Commit.commit commit} For mutation-based updates
	 * @see {@link Wrap.wrap wrap} For reusable parameterized updates
	 */
	merge( nextState: DeepPartial<NS> ): History<S>
	merge<SP extends NestedRecordKeys<NS>,>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, StringPathToArray<SP>>
	): History<S>
	merge<SP extends StringPathToArray<NestedRecordKeys<NS>>,>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, SP>
	): History<S>
};
