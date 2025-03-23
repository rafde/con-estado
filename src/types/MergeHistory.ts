import type { DeepPartial, } from './DeepPartial';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

/**
 * Defines methods for merging updates into the history state.
 *
 * @template S - The base state type extending DS (Data Structure)
 * @template NS - The history state type, defaults to HistoryState<S>
 *
 * @example
 * ```typescript
 * type State = {
 *   user: {
 *     name: string;
 *     settings: {
 *       theme: string;
 *     };
 *   };
 *   posts: Array<{ id: number; title: string; }>;
 * };
 *
 * // Full state merge
 * mergeHistory({
 *   state: { user: { name: 'John' } },
 *   initial: { posts: [] }
 * });
 *
 * // Path-based merge with string path
 * mergeHistory('state.user.settings', { theme: 'dark' });
 *
 * // Path-based merge with array path
 * mergeHistory(['state', 'posts', 0], { title: 'Updated' });
 * ```
 */
export type MergeHistory<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
> = {
	/**
		* @overload
		* Merge partial `state` and/or `initial` with a partial object
		*
		* @param nextState - Partial state object containing updates for `state` and/or `initial`
		*
		* ```ts
		* mergeHistory( {
		*   state: { count: 1 },
		*   initial: { items: ['new'] }
		* } );
		* ```
		*
		* @returns Updated history object
		*
		* @example

		*/
	mergeHistory( nextState: DeepPartial<NS> ): History<S>
	/**
		* `mergeHistory` updates `state` or `initial` at a specific string path in the history state using a dot-bracket-notation for path.
		*
		* @param statePath - Dot-bracket-notation string path to the target location (e.g., 'initial.user.profile.name[0]')
		*
		* #### Merging history for non-exising path
		*
		* If part of path does not exist, it will be created an `object` if the path is a `string` or an `array` if the path is a `number`.
		*
		* ```ts
		* // initial = {};
		*
		* mergeHistory( 'initial.posts[1]', { title: 'Second post', content: 'Second post content', }, );
		*
		* // initial = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ] };
		* ```
		*
		* If the path exists, but is not a plain `object` or `array`, it will throw an `Error`.
		*
		* ```ts
		* // initial.posts = 1
		*
		* mergeHistory( 'initial.posts[1]', { title: 'First post', }, ); // throws error
		* ```
		*
		* #### Merging history with special character path
		*
		* Keys containing dots `.` or opening bracket `[` must be escaped with backslashes
		*
		* ```ts
		* // initial = {
		* //   path: {
		* //     'user.name[s]': 'Name',
		* //   },
		* // };
		*
		* mergeHistory( 'initial.path.user\\.name\\[s]', 'New Name', );
		* ```
		*
		* #### Merging history with negative indices
		*
		* Negative indices allowed, but they can't be out of bounds. E.g., `initial.posts[-1]` is valid if 'posts' has at least one element.
		*
		* ```ts
		* // initial = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ], }
		*
		* mergeHistory( 'initial.posts[-1]', { title: 'Updated Second Title', });
		* // initial = { posts: [
		* //   undefined,
		* //   { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( 'initial.posts[-2]', { title: 'Updated First Content' }, );
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( 'initial.posts[-3]', { title: 'Third Title', }, ); // throws error
		* ```
		*
		* @param nextState - Plain Object or Array to merge at the specified path.
		*
		* #### Merging history for non-plain `objects` or `arrays`
		*
		* Non-plain `object` or `array` will replace the target values instead of merging.
		*
		* #### Merging history arrays
		*
		* Merging parts of an `array` requires using sparse `array` to indicate which elements to update.
		*
		* ```ts
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( 'initial.posts', [ undefined, { title: 'New', }, ], ); // updates the second element
		*
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( 'initial.posts', [ { title: 'New', }, ] ); // updates the first element
		*
		* // state = { posts: [
		* //  { title: 'New', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		* ```
		* #### Merging history for an empty array
		*
		* Merging an empty `array` does nothing to the target `array`.
		*
		* ```ts
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( 'initial.posts', [] ); // does nothing
		* ```
		* If you want to clear an `array`, use {@link SetHistory.setHistory setHistory} instead.
		*
		*  @returns Updated history object
		*/
	mergeHistory<SP extends NestedRecordKeys<NS>,>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, StringPathToArray<SP>>
	): History<S>
	/**
		* `mergeHistory` updates `state` or `initial` at a specific path in the history `state` using an `array` of `string`s or `number`s (for `array`s).
		*
		* @param statePath - Array of path segments to the target location.
		*
		* `Array` paths provide an alternative to dot-bracket-notation `string`s and are useful when:
		* - Working with dynamically constructed paths
		* - Dealing with keys that contain `.` or `[`
		* - Need to avoid `string` parsing overhead
		* - Working with computed or variable path segments
		*
		* #### Merging history for non-exising path
		*
		* If part of path does not exist, it will be created an `object` if the path is a `string` or an `array` if the path is a `number`.
		*
		* ```ts
		* // initial = {};
		*
		* `mergeHistory( [ 'initial', 'posts', 1, ], { title: 'Second post', content: 'Second post content', }, );`
		*
		* // initial = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ] };
		* ```
		*
		* If the path exists, but is not a plain `object` or `array`, it will throw an `Error`.
		*
		* ```ts
		* // initial.posts = 1
		*
		* `mergeHistory( [ 'initial', 'posts', 1, ], { title: 'First post', }, )` // throws error
		* ```
		*
		* #### Merging history with special character path
		*
		* Unlike string paths, keys containing dots or brackets do not need to be escaped.
		*
		* ```ts
		* // initial = {
		* //   path: {
		* //     'user.name[s]': 'Name',
		* //   },
		* // };
		*
		* mergeHistory( [ 'initial', 'path', 'user.name[s]' ], 'New Name', );
		* ```
		*
		* #### Negative indices
		*
		* Negative indices allowed, but they can't be out of bounds. E.g., `['posts', -1]` is valid if 'posts' has at least one element.
		*
		* ```ts
		* // initial = { posts: [
		* //  undefined,
		* //  { title: 'Second post', content: 'Second post content', },
		* // ], }
		*
		* mergeHistory( [ 'initial', 'posts', -1 ], { title: 'Updated Second Title', });
		* // initial = { posts: [
		* //   undefined,
		* //   { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( [ 'initial', 'posts', -2 ], { title: 'Updated First Content' }, );
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( [ 'initial', 'posts' -3 ], { title: 'Third Title', }, ); // throws error
		* ```
		*
		* @param nextState - Plain `Object` or `Array` to merge at the specified path.
		*
		* #### Merging non-plain `objects` or `arrays`
		*
		* Non-plain `object` or `array` will replace the target values instead of merging.
		*
		* ```ts
		* mergeHistory( [ 'initial', 'user', 'firstName' ], 'New Name', );
		*
		* // initial = { user: { firstName: 'New Name', }, };
		* ```
		*
		* #### Merging history for Arrays
		*
		* Merging parts of an `array` requires using sparse `array` to indicate which elements to update.
		*
		* ```ts
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( [ 'initial', 'posts' ], [ undefined, { title: 'New', }, ], ); // updates the second element
		*
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( [ 'initial', 'posts' ], [ { title: 'New', }, ] ); // updates the first element
		*
		* // initial = { posts: [
		* //  { title: 'New', },
		* //  { title: 'New', content: 'Second post content', },
		* // ], };
		* ```
		* #### Merging history for an empty array
		*
		* Merging an empty `array` does nothing to the target `array`.
		*
		* ```ts
		* // initial = { posts: [
		* //  { title: 'Updated First Content', },
		* //  { title: 'Updated Second Title', content: 'Second post content', },
		* // ], };
		*
		* mergeHistory( [ 'initial', 'posts' ], [] ); // does nothing
		* ```
		* If you want to clear an `array`, use {@link SetHistory.setHistory setHistory} instead.
		*
		* @returns Updated history object
		*/
	mergeHistory<SP extends StringPathToArray<NestedRecordKeys<NS>>,>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, SP>
	): History<S>
};
