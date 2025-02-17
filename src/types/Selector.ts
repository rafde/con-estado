import type { ActRecord, } from './ActRecord';
import type { CreateConReturnType, } from './createConReturnType';
import type { DS, } from './DS';
import type { Immutable, } from './Immutable';

/**
 * Function that selects and transforms state data into a derived value.
 *
 * @template S - The state type
 * @template AR - Action record type
 * @template R - Return type of the selector
 * @param {CreateConReturnType<S, AR> & Immutable<{ state: S }>} selectorProps - Props containing state and controls
 * @returns {R} The derived value
 *
 * @example
 * ```ts
 * const selectActiveToDonts: Selector<State, Actions, ToDont[]> = ({ state }) =>
 *   state.toDonts.filter(toDont => !toDont.completed)
 *```
 *
 * @example
 * ```ts
 * const selectUserStats: Selector<State, Actions, UserStats> = ({ state, get }) => ({
 *   totalUsers: state.users.length,
 *   activeUsers: state.users.filter(u => u.active).length,
 *   topScorer: state.users.reduce((top, user) =>
 *     user.score > top.score ? user : top
 *   ),
 *   previousTopScorer: get('prev.users')?.reduce((top, user) =>
 *     user.score > top.score ? user : top
 *   )
 * })
 * ```
 */
export type Selector<
	S extends DS,
	AR extends ActRecord,
	R = unknown,
> = ( selectorProps: CreateConReturnType<S, AR> & Immutable<{ state: S }> ) => R;
