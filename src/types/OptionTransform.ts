import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';

/**
 * Transform function to modify state through draft mutations before changes are committed.
 *
 * @template S - The state type
 * @param {Draft<HistoryState<S>>} draft - Mutable draft of the history state
 * @param {History<S>} history - Current immutable history state
 * @param {'set' | 'reset'} type - The type of operation being performed
 *
 * @example
 * ```ts
 * const transform: OptionTransform<State> = (draft, history, type) => {
 *   // Add timestamps to all updates
 *   draft.state.lastModified = Date.now()
 *
 *   // Validate numeric values
 *   draft.state.count = Math.max(0, draft.state.count)
 *
 *   // Maintain sorted order
 *   if (draft.state.items?.length) {
 *     draft.state.items.sort((a, b) => a.priority - b.priority)
 *   }
 *
 *   // Track operation type
 *   draft.state.lastOperation = type
 * }
 *```
 *
 * @example
 * ```ts
 * const transform: OptionTransform<State> = (draft, history, type) => {
 *   // Format text fields
 *   draft.state.users.forEach(user => {
 *     user.name = user.name.trim()
 *     user.email = user.email.toLowerCase()
 *   })
 *
 *   // Add metadata
 *   draft.state.meta = {
 *     updatedAt: new Date().toISOString(),
 *     operation: type,
 *     previousVersion: history.state.meta?.version,
 *     version: history.state.meta?.version + 1
 *   }
 * }
 * ```
 */
export type OptionTransform<S extends DS,> = ( draft: Draft<HistoryState<S>>, history: History<S>, type: 'set' | 'reset' ) => void;
