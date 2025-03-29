import type { DeepPartial, } from './DeepPartial';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

/**
 * Defines methods for merging updates into the current state.
 * Similar to MergeHistory but operates only on the current state rather than the history state.
 *
 * @template S - The base state type extending DS (Data Structure)
 *
 * @example
 * ```typescript
 * type State = {
 *   user: {
 *     profile: {
 *       name: string;
 *       email: string;
 *     };
 *     preferences: {
 *       theme: 'light' | 'dark';
 *     };
 *   };
 *   posts: Array<{
 *     id: number;
 *     title: string;
 *     content: string;
 *   }>;
 * };
 *
 * // Full state merge
 * merge({
 *   user: {
 *     profile: { name: 'John Doe' }
 *   }
 * });
 *
 * // Path-based merge with string path
 * merge('user.preferences', { theme: 'dark' });
 *
 * // Path-based merge with array path
 * merge(['posts', 0], { title: 'Updated Title' });
 * ```
 */
export type Merge<S extends DS,> = {
	/**
		* `merge` a partial state object into the current state.
		*
		* @param nextState - Partial state object containing the updates
		*
		* ```ts
		* // state.user = {
		* //   profile: { firstName: 'John', },
		* //   preferences: { theme: 'light', },
		* // };
		*
		* merge( {
		*   user: {
		*     profile: { lastName: 'Doe', },
		*     preferences: { theme: 'dark', },
		*   }
		* } );
		*
		* // state.user = {
		* //   profile: { firstName: 'John', lastName: 'Doe', },
		* //   preferences: { theme: 'dark', },
		* // };
		* ```
		*
		* @returns Updated history object
		*/
	merge( nextState: DeepPartial<S> ): History<S>
	/**
		* `merge` updates `state` at a specific `string` path, e.g. 'user.profile', using a dot-bracket-notation for path.
		*
		* @param statePath - Dot-bracket-notation `string` path to the target location (e.g., 'user.profile.name[0]')
		*
		* #### Merging non-exising path
		*
		* If part of path does not exist, it will be created an `object` if the path is a `string` or an `array` if the path is a `number`.
		*
		* ```ts
		* // state = {};
		*
		* merge( 'posts[1]', { title: 'Second post', content: 'Second post content', }, );
		*
		* // state = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ] };
		* ```
		*
		* If the path exists, but is not a plain `object` or `array`, it will throw an `Error`.
		*
		* ```ts
		* // state.posts = 1
		*
		* merge( 'posts[1]', { title: 'First post', }, ); // throws error
		* ```
		*
		* #### Merging with special character path
		*
		* Keys containing dots `.` or opening bracket `[` must be escaped with backslashes
		*
		* ```ts
		* // state = {
		* //   path: {
		* //     'user.name[s]': 'Name',
		* //   },
		* // };
		*
		* merge( 'path.user\\.name\\[s]', 'New Name', );
		* ```
		*
		* #### Merging with negative indices
		*
		* Negative indices allowed, but they can't be out of bounds. E.g., `posts[-1]` is valid if 'posts' has at least one element.
		*
		* ```ts
		* // state = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ], }
		*
		* merge( 'posts[-1]', { title: 'Updated Second Title', });
		* // state = { posts: [
		* //   undefined,
		* //   { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( 'posts[-2]', { title: 'Updated First Content' }, );
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( 'posts[-3]', { title: 'Third Title', }, ); // throws error
		* ```
		*
		* @param nextState - Plain `Object` or `Array` to merge at the specified path.
		*
		* #### Merging non-plain `objects` or `arrays`
		*
		* Non-plain `object` or `array` will replace the target values instead of merging.
		*
		* #### Merging arrays
		*
		* Merging parts of an `array` requires using sparse `array` to indicate which elements to update.
		*
		* ```ts
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( 'posts', [ undefined, { title: 'New', }, ], ); // updates the second element
		*
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		*
		* merge( 'posts', [ { title: 'New', }, ] ); // updates the first element
		*
		* // state = { posts: [
		* //  { title: 'New', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		* ```
		* #### Merging an empty array
		*
		* Merging an empty `array` does nothing to the target `array`.
		*
		* ```ts
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( 'posts', [] ); // does nothing
		* ```
		* If you want to clear an `array`, use {@link Set.set set} instead.
		*
		*  @returns Updated history object
		*/
	merge<SP extends NestedRecordKeys<S>,>(
		statePath: SP,
		nextState: GetArrayPathValue<S, StringPathToArray<SP>>
	): History<S>
	/**
		* `merge` updates `state` at a specific path in the current `state` using an `array` of `string`s or `number`s (for `array`s).
		*
		* @param statePath - `Array` of path segments to the target location.
		*
		* `Array` paths provide an alternative to dot-bracket-notation `string`s and are useful when:
		* - Working with dynamically constructed paths
		* - Dealing with keys that contain `.` or `[`
		* - Need to avoid `string` parsing overhead
		* - Working with computed or variable path segments
		*
		* #### Merging non-exising path
		*
		* If part of path does not exist, it will be created an `object` if the path is a `string` or an `array` if the path is a `number`.
		*
		* ```ts
		* // state = {};
		*
		* `merge( [ 'posts', 1, ], { title: 'Second post', content: 'Second post content', }, );`
		*
		* // state = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ] };
		* ```
		*
		* If the path exists, but is not a plain `object` or `array`, it will throw an `Error`.
		*
		* ```ts
		* // state.posts = 1
		*
		* `merge( [ 'posts', 1, ], { title: 'First post', }, )` // throws error
		* ```
		*
		* #### Merging with special character path
		*
		* Unlike string paths, keys containing dots or brackets do not need to be escaped.
		*
		* ```ts
		* // state = {
		* //   path: {
		* //     'user.name[s]': 'Name',
		* //   },
		* // };
		*
		* merge( [ 'path', 'user.name[s]' ], 'New Name', );
		* ```
		*
		* #### Negative indices
		*
		* Negative indices allowed, but they can't be out of bounds. E.g., `['posts', -1]` is valid if 'posts' has at least one element.
		*
		* ```ts
		* // state = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ], }
		*
		* merge( [ 'posts', -1 ], { title: 'Updated Second Title', });
		* // state = { posts: [
		* //   undefined,
		* //   { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( [ 'posts', -2 ], { title: 'Updated First Content' }, );
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( [ 'posts' -3 ], { title: 'Third Title', }, ); // throws error
		* ```
		*
		* @param nextState - Plain `Object` or `Array` to merge at the specified path.
		*
		* #### Merging non-plain `objects` or `arrays`
		*
		* Non-plain `object` or `array` will replace the target values instead of merging.
		*
		* ```ts
		* merge( [ 'user', 'firstName' ], 'New Name', );
		*
		* // state = { user: { firstName: 'New Name', }, };
		* ```
		*
		* #### Merging Arrays
		*
		* Merging parts of an `array` requires using sparse `array` to indicate which elements to update.
		*
		* ```ts
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( [ 'posts' ], [ undefined, { title: 'New', }, ], ); // updates the second element
		*
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		*
		* merge( [ 'posts' ], [ { title: 'New', }, ] ); // updates the first element
		*
		* // state = { posts: [
		* //  { title: 'New', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		* ```
		* #### Merging an empty array
		*
		* Merging an empty `array` does nothing to the target `array`.
		*
		* ```ts
		* // state = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* merge( [ 'posts' ], [] ); // does nothing
		* ```
		* If you want to clear an `array`, use {@link Set.set set} instead.
		*
		* @returns Updated history object
		*/
	merge<SP extends StringPathToArray<NestedRecordKeys<S>>,>(
		statePath: SP,
		nextState: GetArrayPathValue<S, SP>
	): History<S>
};
