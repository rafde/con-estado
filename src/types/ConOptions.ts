import type { Draft, } from 'mutative';
import type { ActRecord, } from './ActRecord';
import type { CreateActsProps, } from './CreateActsProps';
import type { DeepPartial, } from './DeepPartial';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { Immutable, } from './Immutable';
import type { ConMutOptions, } from './ConMutOptions';
import type { DS, } from './DS';

export type ConOptions<
	S extends DS,
	AR extends ActRecord,
	MO extends ConMutOptions = ConMutOptions,
> = {
	/**
	 * Optional factory function for creating a Record of action handlers and state transformations.
	 * The action handlers have access to a subset of the controls object.
	 *
	 * @param {object} props - Accessing state {@link CreateActsProps setters and getters}
	 * @param {SetState.set} props.set - See {@link SetState.set set}
	 * @returns Record of keys with {@link ActRecord sync and async functions}
	 * @example
	 * ```ts
	 * const options = {
	 *   acts: (controls) => ({
	 *     increment: () => controls.set(({ draft }) => {
	 *       draft.count += 1
	 *     }),
	 *     addItem: (item) => controls.set(['items'], ({ draft }) => {
	 *       draft.push(item)
	 *     })
	 *   })
	 * }
	 * ```
	 */
	acts?: ( props: CreateActsProps<S> ) => AR
	/**
	 * Post-change async callback function executed after state changes are applied.
	 * Provides access to the updated {@link History history}.
	 *
	 * @template S - The state type
	 * @param {Immutable<History<S>>} history - The updated immutable {@link History history}.
	 * @returns {Promise<void> | void} Optional promise if async operations needed
	 *
	 * @example
	 * ```ts
	 * const options = {
	 *   afterChange: (history) => {
	 *     console.log('State updated:', history.state)
	 *     console.log('Previous state:', history.prev)
	 *     localStorage.setItem('appState', JSON.stringify(history.state))
	 *   }
	 * }
	 * ```
	 *
	 * @example
	 * ```ts
	 * const options = {
	 *   afterChange: ({ state, prev, initial }) => {
	 *     if (state.count !== prev?.count) {
	 *       analytics.track('count_changed', {
	 *         from: prev?.count,
	 *         to: state.count,
	 *         initial: initial.count
	 *       })
	 *     }
	 *   }
	 * }
	 * ```
	 * @example
	 * ```ts
	 * const options = {
	 *   afterChange: async (history) => {
	 *     // Async operations
	 *     await api.saveState(history.state)
	 *     await db.recordChanges(history.changes)
	 *     await notifications.send({
	 *       type: 'state_updated',
	 *       data: history.state
	 *     })
   *   }
	 * }
	 * ```
	 */
	afterChange?: (
		history: Immutable<History<S>>,
	) => Promise<void> | void
	/**
	 * Additional mutation options that can be passed to control state updates.
	 * Allows customizing how mutations are handled and processed.
	 *
	 * @template MO - Mutation options type
	 * @property {MO} mutOptions - Configuration options for mutations
	 *
	 * @example
	 * ```ts
	 * const options = {
	 *   mutOptions: {
	 *     freeze: true, // Freeze objects after mutations
	 *     strict: true, // Enforce strict mode for mutations
	 *   }
	 * }
	 * ```
	 */
	mutOptions?: MO
	/**
	 * Transform function to modify state before it's committed to history.
	 * Enables validation, normalization, or transformation of state updates.
	 *
	 * @template S - The state type
	 * @param {object} params - available parameters
	 * @param {Draft<HistoryState>} params.draft - Mutable draft of the {@link HistoryState history state}
	 * @param {History} params.history - Current immutable {@link History history}
	 * @param {'set' | 'reset'} params.type - The operation type ('set' | 'reset') that triggered changes.
	 * @param {Partial<HistoryState>} params.patches -  A partial state object that contains the latest deeply nested
	 * changes made to `state` and/or `initial`. Useful for when you want to include additional changes based on what `patches` contains.
	 *
	 * @example
	 * ```ts
	 * const options = {
	 *   transform: ({draft}) => {
	 *     // Add timestamps to all updates
	 *     draft.state.lastModified = Date.now()
	 *     // Maintain sorted order of items
	 *     draft.state.items.sort((a, b) => a.priority - b.priority)
	 *   }
	 * }
	 * ```
	 *
	 * @example
	 * ```ts
	 * const options = {
	 *   transform: ({draft, patches}) => {
	 *     // Ensure count never goes negative
	 *     const patchCount = patches?.state?.count;
	 *     if (typeof patchCount === 'number' && count > 10) {
	 *       // don't let count go over 10 for whatever reason
	 *       draft.count = 10;
	 *     }
	 *   }
	 * }
	 *```

	 */
	transform?: ( params: {
		draft: Draft<HistoryState<S>>
		history: History<S>
		patches: DeepPartial<HistoryState<S>>
		type: 'set' | 'reset' | 'merge'
	} ) => void
};
