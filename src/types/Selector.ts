import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { SelectorProps, } from './SelectorProps';

/**
 * A type-safe selector function for extracting and transforming state data.
 * Used with both `useCon` for component-local state and `useConSelector` for global state.
 *
 * @typeParam S - The state type extending DS (Data Structure)
 * @typeParam AR - Action Record type containing available actions
 * @typeParam SP - Selector Props type extending Record<string, unknown>
 * @typeParam R - Return type of the selector (defaults to unknown)
 *
 * @param {SelectorProps} selectorProps - Props containing state and controls
 * @returns {unknown} The transformed state or computed value
 *
 * @remarks
 * - When returning functions, they won't trigger re-renders on reference changes
 * - Selectors can be used both directly with `useCon`/`createConStore` or via their `useSelector` property
 * - Selectors help prevent unnecessary re-renders by only updating when selected values change
 *
 * @example Local State with useCon - Basic Usage
 * ```typescript
 * function Counter() {
 *   const { count, increment } = useCon(
 *     { count: 0 },
 *     {
 *       acts: ({ commit }) => ({
 *         increment: () => commit('count', ({ stateProp }) => stateProp++)
 *       })
 *     },
 *     ({ state, acts }) => ({
 *       count: state.count,
 *       increment: acts.increment
 *     })
 *   );
 *
 *   return <button onClick={increment}>Count: {count}</button>;
 * }
 * ```
 *
 * @example Local State with useCon - Using useSelector
 * ```typescript
 * function ExpensiveList() {
 *   const [state, { useSelector }] = useCon({
 *     items: [],
 *     filter: ''
 *   });
 *
 *   // Only updates when filtered items change
 *   const filteredItems = useSelector(({ state }) =>
 *     state.items.filter(item => item.includes(state.filter))
 *   );
 *
 *   return <div>{filteredItems.map(item => <div key={item}>{item}</div>)}</div>;
 * }
 * ```
 *
 * @example Global State with createConStore
 * ```typescript
 * interface AppState {
 *   user: User;
 *   settings: Settings;
 * }
 *
 * const useStore = createConStore<AppState>(initialState);
 *
 * // In component:
 * function UserProfile() {
 *   const userData = useStore(({ state }) => ({
 *     name: state.user.name,
 *     email: state.user.email
 *   }));
 *
 *   return <div>{userData.name} ({userData.email})</div>;
 * }
 * ```
 *
 * @example Combining Local and Global State
 * ```typescript
 * const useGlobalStore = createConStore({ theme: 'light' });
 *
 * function ThemeAwareCounter() {
 *   const theme = useGlobalStore(({ state }) => state.theme);
 *
 *   const { count, increment } = useCon(
 *     { count: 0 },
 *     {
 *       acts: ({ set }) => ({
 *         increment: () => set('count', c => c + 1)
 *       })
 *     },
 *     ({ state, acts }) => ({
 *       count: state.count,
 *       increment: acts.increment
 *     })
 *   );
 *
 *   return (
 *     <button
 *       onClick={increment}
 *       style={{ background: theme === 'light' ? '#fff' : '#000' }}
 *     >
 *       Count: {count}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example Advanced Selector Patterns
 * ```typescript
 * function TodoList() {
 *   const [state, { useSelector }] = useCon({
 *     todos: [],
 *     filter: '',
 *     sort: 'date'
 *   });
 *
 *   // Complex computed values with multiple dependencies
 *   const todoStats = useSelector(({ state }) => ({
 *     filtered: state.todos.filter(t => t.title.includes(state.filter)),
 *     total: state.todos.length,
 *     completed: state.todos.filter(t => t.completed).length
 *   }));
 *
 *   // Conditional function return (won't cause re-renders)
 *   const addTodo = useSelector(({ state, wrap }) =>
 *     state.todos.length < 10
 *       ? wrap('todos', ({ stateProp }, todo) => { stateProp.push(todo); })
 *       : () => console.warn('Too many todos!')
 *   );
 *
 *   return (
 *     <div>
 *       <div>Total: {todoStats.total}</div>
 *       <div>Completed: {todoStats.completed}</div>
 *       <div>Filtered: {todoStats.filtered.length}</div>
 *       <button onClick={() => addTodo({ title: 'New Todo' })}>Add</button>
 *     </div>
 *   );
 * }
 * ```
 */
export type Selector<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown>,
	R = unknown,
> = ( selectorProps: SelectorProps<S, AR, SP> ) => R;
