import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { ConMutOptions, } from './ConMutOptions';
import type { StringPathToArray, } from './StringPathToArray';

export type GetDraftRecord<
	S extends DS,
	MO extends ConMutOptions = ConMutOptions,
> = {
	/**
	 * Gets a mutable draft of the state history and a function to commit changes.
	 * @template S - The state type
	 *
	 * @param {ConMutOptions} [options] - Optional mutation options
	 * @returns {[Draft<HistoryState<S>>, () => History<S>]} Tuple containing:
	 *   - Mutable draft of the state history
	 *   - Function to commit draft changes and return updated history
	 *
	 * @example
	 * ```ts
	 * const [
	 * 	state,
	 * 	controls,
	 * ] = useCon( {status: '', error: '', data: {}}, {
	 * 	acts( { getDraft } ) {
	 * 		async modifyFirstItem() {
	 * 			const [draft, commit] = getDraft();
	 * 			draft.state.status = 'loading';
	 * 			commit();
	 *
	 * 			const [draft2, commit2] = controls.getDraft()
	 * 			try {
	 * 				const result = await api.fetchData()
	 *
	 * 				draft2.state.data = result
	 * 				draft2.state.status = 'success'
	 *
	 * 			} catch (error) {
	 * 				draft2.state.status = 'error'
	 * 				draft2.state.error = error.message
	 * 			}
	 *
	 * 			commit2()
	 * 		}
	 * 	}
	 * });
	 * ```
	 */
	getDraft( options?: MO ): readonly [
		Draft<HistoryState<S>>,
		() => History<S>,
	]
	/**
	 * Gets a mutable draft of a specific property in the state history and a function to commit changes.
	 * @template S - The state type
	 * @template SHP - String path type for accessing nested history properties
	 * @template MO - Mutation options type
	 *
	 * @param {SHP} stateHistoryPath - Dot notation path to the desired property
	 * @param {ConMutOptions} [options] - Optional mutation options
	 * @returns {[Draft<HistoryState<S>>, () => History<S>]} Tuple containing:
	 *   - Mutable draft of the specified property
	 *   - Function to commit draft changes and return updated history
	 */
	getDraft<
		SHP extends NestedObjectKeys<HistoryState<S>>,
		MO extends ConMutOptions = ConMutOptions,
	>( stateHistoryPath: SHP, options?: MO ): readonly [
		GetArrayPathValue<
			Draft<HistoryState<S>>,
			StringPathToArray<SHP>
		>,
		() => History<S>,
	]
};
