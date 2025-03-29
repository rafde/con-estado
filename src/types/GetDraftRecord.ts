import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { ConMutOptions, } from './ConMutOptions';

export type GetDraftRecord<
	S extends DS,
	MO extends ConMutOptions = ConMutOptions,
> = {
	/**
	 * Gets a mutable historyDraft of the state history and a function to commit changes.
	 * @template S - The state type
	 *
	 * @param {ConMutOptions} [options] - Optional mutation options
	 * @returns {[Draft<HistoryState<S>>, () => History<S>]} Tuple containing:
	 *   - Mutable historyDraft of the state history
	 *   - Function to commit historyDraft changes and return updated history
	 *
	 * @example
	 * ```ts
	 * const [
	 * 	state,
	 * 	controls,
	 * ] = useCon( {status: '', error: '', data: {}}, {
	 * 	acts( { getDraft } ) {
	 * 		async modifyFirstItem() {
	 * 			const [historyDraft, commit] = getDraft();
	 * 			historyDraft.state.status = 'loading';
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
		( type?: 'set' | 'reset' | 'merge' | 'commit' | 'wrap', ) => History<S>,
	]
};
