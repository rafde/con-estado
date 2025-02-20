import type { DS, } from './DS';
import type { History, } from './History';
import type { Setters, } from './Setters';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { Immutable, } from './Immutable';
import type { NestedRecordKeys, } from './NestedRecordKeys';

export type CreateActsProps<
	S extends DS,
> = {
	/**
	 * Gets the current state history in an immutable form.
	 *
	 * @returns The current state history object
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   logState: () => {
	 *     const history = controls.get()
	 *     console.log('Current state:', history.state)
	 *     console.log('Initial state:', history.initial)
	 *     console.log('Previous state:', history.prev)
	 *   }
	 * })
	 *```
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   saveSnapshot: () => {
	 *     const { state, changes } = controls.get()
	 *     localStorage.setItem('stateSnapshot', JSON.stringify({
	 *       data: state,
	 *       modifications: changes
	 *     }))
	 *   }
	 * })
	 * ```
	 */
	get(
		stateHistoryPath?: undefined
	): Immutable<History<S>>
	/**
	 * Gets an immutable value from the state history at the specified path.
	 *
	 * @template SHP - String path type for accessing nested history properties
	 * @param {SHP} stateHistoryPath - Dot notation path to the desired property
	 * @returns The value at the specified path
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   logUserDetails: () => {
	 *     const userName = controls.get('state.user.name')
	 *     const previousScore = controls.get('prev.user.score')
	 *     const initialRole = controls.get('initial.user.role')
	 *     console.log(`User ${userName} had score ${previousScore}, started as ${initialRole}`)
	 *   }
	 * })
	 * ```
	 *
	 * @example
	 * ```ts
	 * const acts = (controls) => ({
	 *   checkProgress: () => {
	 *     const currentLevel = controls.get('state.game.level')
	 *     const startingLevel = controls.get('initial.game.level')
	 *     const levelsGained = currentLevel - startingLevel
	 *     console.log(`Advanced ${levelsGained} levels from start`)
	 *   }
	 * })
	 * ```
	 */
	get<SHP extends NestedRecordKeys<History<S>>,>(
		stateHistoryPath: SHP
	): Immutable<GetStringPathValue<History<S>, SHP>>
}
// & GetDraftRecord<S>
& Setters<S>;
