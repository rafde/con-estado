/**
 * Represents a Record Data Structure - an object with string or number keys and unknown values
 *
 * @remarks
 * This type is used as a constraint for state objects in the library
 *
 * @example
 * ```ts
 * // Examples of valid RDS objects:
 * const user = { name: 'John', age: 30 };
 * const settings = { theme: 'dark', notifications: true };
 * ```
 */
export type RDS = Record<string | number, unknown>;

/**
 * Represents an Array Data Structure - an array of unknown values
 *
 * @remarks
 * This type is used as a constraint for state arrays in the library
 *
 * @example
 * ```ts
 * // Examples of valid ADS arrays:
 * const items = ['apple', 'banana', 'orange'];
 * const mixed = [1, 'two', { three: 3 }];
 * ```
 */
export type ADS = Array<unknown>;

/**
 * Represents a Data Structure - either a record object or an array
 *
 * @remarks
 * This is the base type constraint for all state containers in the library.
 * All state must be either a plain object or an array.
 *
 * @example
 * ```ts
 * // Creating a store with an object state (RDS)
 * const useStore = createConStore({ count: 0, text: '' });
 *
 * // Creating a store with an array state (ADS)
 * const useListStore = createConStore(['item1', 'item2']);
 * ```
 */
export type DS = RDS | ADS;
