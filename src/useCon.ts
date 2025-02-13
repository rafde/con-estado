import { useState, } from 'react';
import createCon from './_internal/createCon';
import defaultSelector, {
	type DefaultSelector,
} from './_internal/defaultSelector';
import isPlainObject from './_internal/isPlainObject';
import useSelectorCallback from './_internal/useSelectorCallback';
import type { ActRecord, } from './types/ActRecord';
import type { DS, } from './types/DS';
import type { Initial, } from './types/Initial';
import type { Option, } from './types/Option';
import type { Selector, } from './types/Selector';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Options as MutOptions, } from 'mutative';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OptionAfterChange, } from './types/OptionAfterChange';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OptionTransform, } from './types/OptionTransform';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { CreateActs, } from './types/CreateActs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { History, } from './types/History';

/**
 * React hook for managing local state with history tracking and actions.
 *
 * @typeParam S - The {@link DS data structure (DS)} that can be used.
 * @typeParam AR - {@link ActRecord Action record} that will return from {@link CreateActs options.acts}
 * @typeParam Sel - {@link Selector}
 *
 * @param initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param [options] - Configuration {@link Option options}.
 *
 * @param {CreateActs} [options.acts] - {@link CreateActs} A callback function that creates reusable actions for state management.
 * Takes control props (set, get, reset, etc.) and returns an object of action functions that can be asynchronous.
 *
 * @example
 * `options.acts` example
 * ```ts
  * const [state, controls] = useCon(
 *   { count: 0 },
 *   {
 *     acts: (controls) => ({
 *       increment: () => controls.set(draft => { draft.count++ }),
 *       decrement: () => controls.set(draft => { draft.count-- })
 *     })
 *   }
 * );
 *
 * // Call the actions
 * controls.acts.increment();
 * controls.acts.decrement();
 * ```
 *
 * @param {OptionAfterChange} [options.afterChange] - {@link OptionAfterChange} A callback that runs after state changes are dispatched.
 * Receives the immutable history object containing the current state, changes, and previous states.
 * Can be async and return a Promise or void.
 *
 * @example
 * `options.afterChange` example
 * ```ts
  * const [state] = useCon(
 *   { count: 0 },
 *   {
 *     afterChange: async (history) => {
 *       // Access state after change
 *       console.log('New count:', history.state.count);
 *       // Access previous state
 *       console.log('Previous count:', history.prev?.count);
 *     }
 *   }
 * );
 * ```
 *
 * @param {MutOptions} [options.mutOptions] - {@link MutOptions} Configuration options for the Mutative library's state updates.
 * Controls how drafts are created and modified. Supports all Mutative options except `enablePatches`.
 * See {@link https://mutative.js.org/docs/api-reference/create#createstate-fn-options---options Mutative Options}
 *
 * @example
 * `options.mutOptions` example
 * ```ts
 * const [state] = useCon(
 *   { items: [] },
 *   {
 *     mutOptions: {
 *       strict: true, // Throws on illegal mutations
 *       enableAutoFreeze: true, // Automatically freezes produced states
 *       enableMapSet: true // Enable Map/Set support
 *     }
 *   }
 * );
 * ```
 *
  * @param {OptionTransform} [options.transform] - {@link OptionTransform} A callback to transform state before it's updated.
 * Receives a mutable draft of both state and initial values, allowing you to modify them before changes are applied.
 * Called during set and reset operations with the corresponding action type.
 *
 * @example
 * `options.transform` example
 * ```ts
 * const [state] = useCon(
 *   { count: 0 },
 *   {
 *     transform: (draft, history, type) => {
 *       // Ensure count never goes below 0
 *       if (type === 'set' && history.state.count < 0) {
 *         draft.state.count = 0;
 *       }
 *
 *       // Reset to initial + 1
 *       if (type === 'reset') {
 *         draft.state.count = history.initial.count + 1;
 *       }
 *     }
 *   }
 * );
 * ```
 *
  * @param {Selector} [selector=DefaultSelector] - {@link Selector} A function to customize the shape of the returned state.
 * By {@link DefaultSelector default}, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @example
 * `selector` example
 * ```ts
 * // Default selector usage: [state, controls]
 * const [state, controls] = useCon({ count: 0 });
 *
 * // Custom selector usage
 * const { count, increment } = useCon(
 *   { count: 0 },
 *   {
 *     acts: controls => ({
 *       increment: () => controls.set(draft => { draft.count++ })
 *     })
 *   },
 *   // Custom selector
 *   ({ state, acts }) => ({
 *     count: state.count,
 *     increment: acts.increment
 *   })
 * );
 * ```
 *
 * @returns Returns state and controls based on the {@link Selector}.
 * - By {@link DefaultSelector default}, returns `[state, controls]` tuple where:
 *   - `state` contains the current state.
 *   - `controls` contains all state management {@link CreateActsProps methods} `&` {@link History history}
  *     - State Methods:
 *       - `set(pathOrCallback, valueOrCallback?)`: Set state at path or with updater function
 *       - `setWrap(pathOrCallback, valueOrCallback?)`: Like set but returns a function for additional args
 *       - `currySet(pathOrCallback)`: Returns a function to set state at path
 *       - `reset()`: Reset state to initial or transformed initial
 *     - History Methods:
 *       - `setHistory(pathOrCallbackOrStateAndHistory, valueOrCallback?)`: Direct history manipulation of `state` or `initial` properties at path or with updater function.
 *       - `setHistoryWrap(pathOrCallback, valueOrCallback?)`: Like setHistory but returns a function for additional args.
 *       - `currySetHistory(pathOrCallback)`: Returns a function for updating `state` or `initial` properties at path
 *     - Query Methods:
 *       - `get(path?)`: Get `state` and `initial`, or value at path
 *       - `getDraft(pathOrMutOptions?, mutOptions?)`: Get mutable draft at path.
 *          Accepts `path` or `mutOptions` to mutate `state` and/or `initial` properties.
 *          Returns `[draft, finalize]`.
 *     - {@link History} Properties:
 *       - `initial`: Initial state
 *       - `state`: Current state
 *       - `changes`: Partial changes from initial
 *       - `prev`: Previous state if changed
 *       - `prevInitial`: Previous initial if changed
 *     - Custom Actions:
 *       - `acts`: Custom actions from options.acts
 * - With custom selector: Returns whatever shape the selector returns. You have access to `controls` via parameter.
 *
 * @example
 * Return example
 * ```ts
 * // Default return type
 * const [
 *   state, {
 *      // State methods
 *      set, setWrap, currySet,
 *      // History methods
 *      reset, setHistory, setHistoryWrap, currySetHistory,
 *      // Query methods
 *      get, // raw history
 *      getDraft, // mutative [draft, finalize]
 *      // History
 *      initial, state, changes, prev, prevInitial,
 *      // Custom actions
 *      acts
 *    }
 * ] = useCon({ count: 0 });
 *
 * // Custom selector return type
 * const {
 *   count,     // Just the count value
 *   increment  // Just the increment action
 * } = useCon(
 *   { count: 0 },
 *   { acts: controls => ({
 *       increment: () => controls.set(d => { d.count++ })
 *     })
 *   },
 *   ({ state, acts }) => ({
 *     count: state.count,
 *     increment: acts.increment
 *   })
 * );
 * ```
 */
export default function useCon<
	S extends DS,
	AR extends ActRecord,
	Sel extends Selector<S, AR> = DefaultSelector<S, AR>,
>(
	initial: Initial<S>,
	options?: Option<S, AR>,
	selector?: Sel
): ReturnType<Sel>;
/**
 * React hook for managing local state with history tracking and actions.
 *
 * @typeParam S - The {@link DS data structure (DS)} that can be used.
 * @typeParam Sel - {@link Selector}
 *
 * @param initial - The initial {@link Initial state object or `function`} that returns the initial state object
 *
 * @param {Selector} selector - {@link Selector} A function to customize the shape of the returned state.
 * By default, returns `[state, controls]`. Create your own selector to return a different structure.
 * Receives all controls and state history as props.
 *
 * @example
 * `selector` example
 * ```ts
 * // Default selector usage: [state, controls]
 * const [state, controls] = useCon({ count: 0 });
 *
 * // Custom selector usage
 * const { count, increment } = useCon(
 *   { count: 0 },
 *   // Custom selector
 *   ({ state, currySet }) => ({
 *     count: state.count,
 *     increment: currySet(({draft}) => draft.count++ )
 *   })
 * );
 * ```
 *
 * @returns Return based on what the {@link Selector} returns. It's provided access to the state and controls.
 * - State Methods:
 *   - `set(pathOrCallback, valueOrCallback?)`: Set state at path or with updater function
 *   - `setWrap(pathOrCallback, valueOrCallback?)`: Like set but returns a function for additional args
 *   - `currySet(pathOrCallback)`: Returns a function to set state at path
 *   - `reset()`: Reset state to initial or transformed initial
 * - History Methods:
 *   - `setHistory(pathOrCallbackOrStateAndHistory, valueOrCallback?)`: Direct history manipulation of `state` or `initial` properties at path or with updater function.
 *   - `setHistoryWrap(pathOrCallback, valueOrCallback?)`: Like setHistory but returns a function for additional args.
 *   - `currySetHistory(pathOrCallback)`: Returns a function for updating `state` or `initial` properties at path
 * - Query Methods:
 *   - `get(path?)`: Get `state` and `initial`, or value at path
 *   - `getDraft(pathOrMutOptions?, mutOptions?)`: Get mutable draft at path.
 *      Accepts `path` or `mutOptions` to mutate `state` and/or `initial` properties.
 *      Returns `[draft, finalize]`.
 * - {@link History} Properties:
 *   - `initial`: Initial state
 *   - `state`: Current state
 *   - `changes`: Partial changes from initial
 *   - `prev`: Previous state if changed
 *   - `prevInitial`: Previous initial if changed
 */
export default function useCon<
	S extends DS,
	Sel extends Selector<S, Record<never, never>>,
>(
	initial: Initial<S>,
	selector: Sel,
): ReturnType<Sel>;
export default function useCon<
	S extends DS,
	AR extends ActRecord,
>(
	initial: Initial<S>,
	options?: unknown,
	selector?: unknown,
) {
	const [
		opts,
		sel,
	] = isPlainObject( options, )
		? [options as Option<S, AR>, selector as Selector<S, AR> | undefined,]
		: [{} as Option<S, AR>, options as Selector<S, AR> | undefined,];

	const selectorCallback = useSelectorCallback<S, AR>(
		defaultSelector<S, AR>,
		sel,
	);
	const [
		state,
		setState,
	] = useState(
		() => {
			const conProps = createCon(
				typeof initial === 'function' ? initial() : initial,
				{
					...opts,
					dispatcher() {
						setState( selectorCallback( {
							...conProps.get(),
							...conProps,
						}, ), );
					},
				},
			);

			return selectorCallback( {
				...conProps.get(),
				...conProps,
			}, );
		},
	);

	return state;
}
