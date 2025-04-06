import { useMemo, useRef, } from 'react';
import defaultSelector from './_internal/defaultSelector';
import getSnapshotSymbol from './_internal/getSnapshotSymbol';
import isPlainObj from './_internal/isPlainObj';
import { createConStore, } from './createConStore';
import type { ActRecord, } from './types/ActRecord';
import type { DefaultSelector, } from './types/DefaultSelector';
import type { DS, } from './types/DS';
import type { Initial, } from './types/Initial';
import type { ConOptions, } from './types/ConOptions';
import type { Selector, } from './types/Selector';
import type { SelectorProps, } from './types/SelectorProps';
import type { UseSelectorProp, } from './types/UseSelectorProp';

/**
 * React hook for managing local component state with advanced state management features.
 * Provides similar functionality to createConStore but scoped to component lifecycle.
 *
 * @template S - Base state type extending DS (Data Structure)
 * @template AR - Action Record type for custom actions
 * @template US - UseSelector prop type for selector customization
 * @template Sel - Selector type with default being DefaultSelector
 *
 * @overload Basic usage with options
 * @param {Initial<DS>} initial - Initial state value or factory function
 * @param {ConOptions<DS, ActRecord>} [options] - Configuration options for state management
 * @param {Selector<DS, ActRecord, UseSelectorProp<DS, ActRecord>>} [selector] - Optional selector function to customize return value
 * @returns Value determined by selector (default: [state, controls])
 *
 * @overload Direct selector usage
 * @param {Initial<DS>} initial - Initial state value or factory function
 * @param {Selector<DS, ActRecord, UseSelectorProp<DS, ActRecord>>} [selector] - Selector function to customize return value
 * @returns Value determined by selector
 *
 * @example Basic Usage
 * ```tsx
 * function Counter() {
 *   const [state, { commit }] = useCon({ count: 0 });
 *
 *   return (
 *     <button onClick={() => commit('count', ({ stateProp }) => stateProp++)}>
 *       Count: {state.count}
 *     </button>
 *   );
 * }
 * ```
 *
 * @example With Custom Actions
 * ```tsx
 * function TodoList() {
 *   const [state, { acts }] = useCon(
 *     { todos: [] },
 *     {
 *       acts: ({ commit }) => ({
 *         addTodo: (text: string) => {
 *           commit('todos', ({ stateProp }) => {
 *             stateProp.push({ id: Date.now(), text });
 *           });
 *         }
 *       })
 *     }
 *   );
 *
 *   return (
 *     <div>
 *       <button onClick={() => acts.addTodo('New Todo')}>Add</button>
 *       {state.todos.map(todo => <div key={todo.id}>{todo.text}</div>)}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example With Custom Selector
 * ```tsx
 * function UserProfile() {
 *   const { name, updateName } = useCon(
 *     { user: { name: '', email: '' } },
 *     {
 *       acts: ({ set }) => ({
 *         updateName: (name: string) => set('state.user.name', name)
 *       })
 *     },
 *     ({ state, acts }) => ({
 *       name: state.user.name,
 *       updateName: acts.updateName
 *     })
 *   );
 *
 *   return <input value={name} onChange={e => updateName(e.target.value)} />;
 * }
 * ```
 *
 * @example With useSelector
 * ```tsx
 * function ExpensiveComponent() {
 *   const [state, { useSelector }] = useCon({ data: [], filter: '' });
 *
 *   // Memoized selection that only updates when relevant data changes
 *   const filteredData = useSelector(({ state }) =>
 *     state.data.filter(item => item.includes(state.filter))
 *   );
 *
 *   return <div>{filteredData.map(item => <div key={item}>{item}</div>)}</div>;
 * }
 * ```
 *
 * @remarks
 * - Hook is memoized internally to prevent unnecessary recreations
 * - Supports all features of createConStore (commit, merge, wrap, etc.)
 * - Provides additional useSelector hook for optimized renders
 * - Maintains type safety across all operations
 * - Supports both synchronous and asynchronous actions
 * - Compatible with React's concurrent features
 *
 * @see {@link createConStore} For global state management
 * @see {@link ConOptions} For available options
 * @see {@link Selector} For selector customization
 * @see {@link ActRecord} For action handlers type
 */
export function useCon<
	S extends DS,
	AR extends ActRecord,
	US extends UseSelectorProp<S, AR>,
	Sel extends Selector<S, AR, US> = DefaultSelector<S, AR, US>,
>(
	initial: Initial<S>,
	options?: ConOptions<S, AR>,
	selector?: Sel
): ReturnType<Sel>;
export function useCon<
	S extends DS,
	Sel extends Selector<S, Record<never, never>, UseSelectorProp<S, Record<never, never>>>,
>(
	initial: Initial<S>,
	selector: Sel,
): ReturnType<Sel>;
export function useCon<
	S extends DS,
	AR extends ActRecord,
	US extends UseSelectorProp<S, AR>,
	Sel extends Selector<S, AR, US> = DefaultSelector<S, AR, US>,
>(
	initial: Initial<S>,
	options?: unknown,
	selector?: unknown,
) {
	const paramsRef = useRef( {
		initial,
		options,
		selector,
	}, );
	const useSelector = useMemo(
		() => {
			const [
				opts,
				sel,
			] = isPlainObj( paramsRef.current.options, )
				? [paramsRef.current.options as ConOptions<S, AR>, paramsRef.current.selector as Sel,]
				: [{} as ConOptions<S, AR>, paramsRef.current.options as Sel,];
			const _useSelector = createConStore<S, AR, US, Sel>(
				paramsRef.current.initial,
				{
					...opts,
					[ getSnapshotSymbol ]: props => ( {
						...props,
						useSelector( sel = defaultSelector<S, AR, US>, ) {
							return _useSelector( sel, );
						},
					} as SelectorProps<S, AR, US> ),
				},
				sel,
			);

			return _useSelector;
		},
		[],
	);

	return useSelector();
}
