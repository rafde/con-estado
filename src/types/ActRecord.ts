/**
 * Represents a record of action functions that can be used to modify state
 *
 * @remarks
 * ActRecord is used to define custom actions for state containers.
 * Each key in the record is an action name, and each value is a function
 * that can take any number of arguments and return any value.
 *
 * The type can also be an empty record when no custom actions are needed.
 *
 * @example
 * ```ts
 * // Example of an ActRecord with custom actions
 * type CounterActions = {
 *   increment: () => void;
 *   incrementBy: (amount: number) => void;
 *   reset: () => void;
 * };
 *
 * // Usage in createConStore
 * const useStore = createConStore(
 *   { count: 0 },
 *   {
 *     acts: ({ commit }) => ({
 *       increment: () => commit(({ state }) => { state.count++ }),
 *       incrementBy: (amount: number) => commit(({ state }) => { state.count += amount }),
 *       reset: () => commit(({ state }) => { state.count = 0 })
 *     })
 *   }
 * );
 * ```
 */
export type ActRecord = Record<
	string | number,
	( ...args: never[] ) => unknown
> | Record<never, never>;
