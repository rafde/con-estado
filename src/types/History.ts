import type { DS, RDS, } from './DS';

/**
 * Represents a historical snapshot of state changes with tracking capabilities
 *
 * @template S - State type extending {@link DS} (Data Structure)
 *
 * @property changes - Shallow differences between current and initial state (`undefined` if there are no changes)
 *   - For arrays: Sparse array where `undefined` means the item has no changes
 *   - For objects: Partial object with changes to top level properties
 * @property initial - Original state reference. It can be changed if needed.
 * @property prev - Previous state snapshot, initially `undefined`
 * @property prevInitial - Previous initial state. Changes if `initial` is changed.
 * @property state - Current state value
 *
 * @example
 * // Initial history state
 * const history = {
 *   initial: { count: 0 },
 *   state: { count: 0 }
 * };
 *
 * @example
 * // After state update
 * const updatedHistory = {
 *   changes: { count: 1 },
 *   initial: { count: 0 },
 *   prev: { count: 0 },
 *   state: { count: 1 }
 * };
 *
 * @example
 * // Array state example
 * const arrayHistory = {
 *   changes: [undefined, 'new-item'], // Index 0 removed, index 1 added
 *   initial: ['initial-item'],
 *   prev: ['initial-item'],
 *   state: [ , 'new-item'] // Sparse array representation
 * };
 *
 * @see {@link DS} Base state type constraint
 * @see {@link RDS} Record state type detection
 */
export type History<S extends DS,> = {
	changes?: ( S extends Array<infer U>
		? Array<U | undefined>
		: S extends RDS
			? Partial<S>
			: never
	)
	initial: S
	prev?: S
	prevInitial?: S
	state: S
};
