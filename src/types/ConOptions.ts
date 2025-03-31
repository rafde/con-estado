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
	 * Factory function for creating custom action handlers and state transformations.
	 * Provides a centralized way to define reusable state operations with full type safety.
	 *
	 * @param {CreateActsProps} props - Object containing state control methods:
	 * - commit: For direct state mutations
	 * - set: For immutable state updates
	 * - wrap: For creating path-specific handlers
	 * - get: For accessing current state
	 * - merge: For merging partial states
	 * - reset: For resetting state to initial
	 *
	 * @returns {ActRecord} Record of action handlers that can be sync or async
	 *
	 * @example Basic Actions
	 * ```typescript
	 * acts: (controls) => ({
	 *   increment: () => controls.commit('state.count', ({ stateProp }) => stateProp++ ),
	 *   addTodo: (text: string) => controls.commit('todos', ({ stateProp }) => {
	 *     stateProp.push({ id: Date.now(), text });
	 *   })
	 * })
	 * ```
	 *
	 * @example Async Actions
	 * ```typescript
	 * acts: ({ commit, set, merge, get }) => ({
	 *   async fetchUser(id: string) {
	 *     const user = await api.getUser(id);
	 *     set('state.user', user);
	 *   },
	 *
	 *   async saveUser(updates: Partial<User>) {
	 *     // Optimistic update
	 *     const prevUser = get('state.user');
	 *     merge('state.user', updates);
	 *     try {
	 *       await api.updateUser(updates);
	 *     } catch (error) {
	 *       // Revert on failure
	 *       set('state.user', prevUser);
	 *       throw error;
	 *     }
	 *   }
	 * })
	 * ```
	 *
	 * @example Path-Specific Actions
	 * ```typescript
	 * acts: ({ wrap }) => ({
	 *   updateTodo: wrap(
	 *     'todos',
	 *     ({ stateProp }, id: string, updates: Partial<Todo>) => {
	 *       const todo = stateProp.find(t => t.id === id);
	 *       if (todo) Object.assign(todo, updates);
	 *     }
	 *   )
	 * })
	 * ```
	 */
	acts?: ( props: CreateActsProps<S> ) => AR
	/**
	 * Pre-commit hook for validating and transforming state before changes are applied.
	 * Enables enforcing business rules, data normalization, and maintaining invariants.
	 *
	 * @param {object} params - Hook parameters
	 * @param {Draft<HistoryState<DS>>} params.historyDraft - Mutable draft of the history state
	 * - state: Mutable state
	 * - initial: Mutable initial state
	 * @param {History} params.history - Current immutable history
	 * - state: Current state
	 * - prev: Previous state
	 * - initial: Initial state
	 * - prevInitial: Previous initial state
	 * - changes: Tracked changes between state and initial
	 * @param {DeepPartial<HistoryState<DS>>} params.patches - Partial state containing pending changes
	 * @param {'set' | 'reset' | 'merge' | 'commit' | 'wrap'} params.type - Operation type that triggered changes
	 *
	 * @example Validation Rules
	 * ```typescript
	 * beforeChange: ({ historyDraft, patches, history }) => {
	 *   // Ensure count stays within bounds
	 *   if (typeof patches?.state?.count === 'number') {
	 *     historyDraft.state.count = Math.min(
	 *       Math.max(0, historyDraft.state.count),
	 *       100
	 *     );
	 *   }
	 *
	 *   // Validate user data
	 *   const email = patches.state.user.email;
	 *   if ( email && !isValidEmail(email)) {
	 *     historyDraft.state.user.email = history.state.user.email;
	 *   }
	 * }
	 * ```
	 *
	 * @example Data Normalization
	 * ```typescript
	 * beforeChange: ( { historyDraft, patches, history } ) => {
	 *   // Trim text fields
	 *   if ( patches.state.user?.name ) {
	 *     historyDraft.state.user.name = patches.state.user.name.trim();
	 *   }
	 *
	 *   // Sort arrays
	 *   if ( Array.isArray( patches?.state?.items ) ) {
	 *     historyDraft.state.items.sort((a, b) => a.order - b.order);
	 *   }
	 *
	 *   // Add metadata
	 *   historyDraft.state.lastModified = Date.now();
	 * }
	 * ```
	 *
	 * @throws {Error} When validation rules are violated
	 */
	beforeChange?: ( params: {
		historyDraft: Draft<HistoryState<S>>
		history: History<S>
		patches: DeepPartial<HistoryState<S>>
		type: 'set' | 'reset' | 'merge' | 'commit' | 'wrap'
	} ) => void
	/**
	 * Post-commit hook for handling side effects after state changes are applied.
	 * Perfect for persistence, synchronization, analytics, and other async operations.
	 *
	 * @param {Immutable<History<S>>} history - Updated immutable history containing:
	 * - state: Current state
	 * - prev: Previous state
	 * - initial: Initial state
	 * - prevInitial: Previous initial state
	 * - changes: Tracked changes between state and initial
	 *
	 * @returns {Promise<void> | void} Optional promise for async operations
	 *
	 * @example Persistence
	 * ```typescript
	 * afterChange: async (history) => {
	 *   // Local storage
	 *   localStorage.setItem('appState', JSON.stringify(history.state));
	 *
	 *   // Database
	 *   if (history.prev?.user !== history.state.user) {
	 *     await db.users.update(history.state.user);
	 *   }
	 * }
	 * ```
	 *
	 * @example Analytics and Logging
	 * ```typescript
	 * afterChange: ({ state, prev, changes }) => {
	 *   // Track specific changes
	 *   if (state.visits !== prev?.visits) {
	 *     analytics.track('visit_count_changed', {
	 *       from: prev?.visits,
	 *       to: state.visits
	 *     });
	 *   }
	 *
	 *   // Log all changes
	 *   console.log('State changes:', changes);
	 * }
	 * ```
	 *
	 * @example External Sync
	 * ```typescript
	 * afterChange: async (history) => {
	 *   // Sync with backend
	 *   await api.syncState(history.state);
	 *
	 *   // Notify other systems
	 *   await websocket.broadcast('state_updated', {
	 *     changes: history.changes,
	 *     timestamp: Date.now()
	 *   });
	 *
	 *   // Update cache
	 *   cache.set('lastState', history.state);
	 * }
	 * ```
	 */
	afterChange?: (
		history: Immutable<History<S>>,
	) => Promise<void> | void
	/**
	 * Configuration options for controlling how mutations are processed.
	 * Allows fine-tuning of state update behavior and performance characteristics.
	 *
	 * @property {ConMutOptions} mutOptions - Mutation configuration extending ConMutOptions
	 *
	 * @example Basic Configuration
	 * ```typescript
	 * mutOptions: {
	 *   enableAutoFreeze: true,        // Freeze objects after mutations
	 *   strict: true,        // Enforce strict mode
	 * }
	 * ```
	 *
	 * @example Performance Tuning
	 * ```typescript
	 * mutOptions: {
	 *   // Disable features for performance
	 *   enableAutoFreeze: false,          // Disable object freezing
	 *
	 *   // Enable features for debugging
	 *   strict: true,           // Catch mutations outside handlers
	 * }
	 * ```
	 *
	 * @see {@link ConMutOptions} For complete list of available options
	 */
	mutOptions?: MO
};
