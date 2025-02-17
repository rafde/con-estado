import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { HistoryState, } from './HistoryState';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { MutOptions, } from './MutOptions';

export type GetDraftRecord<
	S extends DS,
	MO extends MutOptions = MutOptions,
> = {
	/**
	 * Gets a mutable draft of the state history and a function to commit changes.
	 *
	 * @param {MutOptions} [options] - Optional mutation options
	 * @returns {[Draft<HistoryState<S>>, () => History<S>]} Tuple containing:
	 *   - Mutable draft of the state history
	 *   - Function to commit draft changes and return updated history
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   bulkUpdate: () => {
	 *     const [draft, commit] = controls.getDraft()
	 *     draft.state.count += 5
	 *     draft.state.items.push('new item')
	 *     draft.state.user.lastUpdated = Date.now()
	 *     return commit()
	 *   }
	 * })
	 * ```
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   optimisticUpdate: async () => {
	 *     const [draft, commit] = controls.getDraft()
	 *     draft.state.status = 'loading'
	 *     commit()
	 *
	 *     try {
	 *       const result = await api.fetchData()
	 *       const [draft2, commit2] = controls.getDraft()
	 *       draft2.state.data = result
	 *       draft2.state.status = 'success'
	 *       commit2()
	 *     } catch (error) {
	 *       const [draft3, commit3] = controls.getDraft()
	 *       draft3.state.status = 'error'
	 *       draft3.state.error = error.message
	 *       commit3()
	 *     }
	 *   }
	 * })
	 * ```
	 */
	getDraft( options?: MO ): [
		Draft<HistoryState<S>>,
		() => History<S>,
	]
	/**
	 * Gets a mutable draft of a specific property in the state history and a function to commit changes.
	 *
	 * @template SHP - String path type for accessing nested history properties
	 * @template MO - Mutation options type
	 * @param {SHP} stateHistoryPath - Dot notation path to the desired property
	 * @param {MutOptions} [options] - Optional mutation options
	 * @returns {[GetStringPathValue<Draft<HistoryState<S>>, SHP>, () => History<S>]} Tuple containing:
	 *   - Mutable draft of the specified property
	 *   - Function to commit draft changes and return updated history
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   updateUserProfile: (newData) => {
	 *     const [userDraft, commit] = controls.getDraft('state.user')
	 *     userDraft.name = newData.name
	 *     userDraft.email = newData.email
	 *     userDraft.lastUpdated = Date.now()
	 *     return commit()
	 *   }
	 * })
	 * ```
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   modifyFirstItem: () => {
	 *     const [itemDraft, commit] = controls.getDraft('state.items.0')
	 *     itemDraft.status = 'modified'
	 *     itemDraft.count *= 2
	 *     itemDraft.tags.push('updated')
	 *     return commit()
	 *   }
	 * })
	 * ```
	 */
	getDraft<
		SHP extends NestedObjectKeys<HistoryState<S>>,
		MO extends MutOptions = MutOptions,
	>( stateHistoryPath: SHP, options?: MO ): [
		GetStringPathValue<
			Draft<HistoryState<S>>,
			SHP
		>,
		() => History<S>,
	]
};
