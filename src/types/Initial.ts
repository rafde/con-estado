import type { DS, } from './DS';

/**
 * Defines the initial state value or factory function.
 *
 * @template S - The state type extending DS (Data Structure)
 * @returns {S} The initial state value
 *
 * @example
 * // Direct initial state value
 * const initial: Initial<State> = {
 *   count: 0,
 *   users: [],
 *   settings: {
 *     theme: 'light',
 *     notifications: true
 *   }
 * }
 *
 * @example
 * // Factory function for dynamic initial state
 * const initial: Initial<State> = () => ({
 *   count: 0,
 *   users: [],
 *   timestamp: Date.now(),
 *   instanceId: generateUniqueId(),
 *   settings: loadStoredSettings() || defaultSettings
 * })
 */
export type Initial<
	S extends DS,
> = S | ( () => S );
