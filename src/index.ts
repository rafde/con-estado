import type { DS, } from './types/DS';
import type { History, } from './types/History';
import type { HistoryState, } from './types/HistoryState';
import type { Immutable, } from './types/Immutable';
import type { NestedKeyArray, } from './types/NestedKeyArray';
import type { NestedRecordKeys, } from './types/NestedRecordKeys';

/**
 * Exports the main store creation function
 * @see createConStore - Function to create a new state container with built-in features
 * @remarks
 * This is the primary entry point for creating new stores in your application.
 * The createConStore function provides state management capabilities with history tracking.
 */
export { createConStore, } from './createConStore';

/**
 * Exports the useCon hook for accessing and managing state within React components
 * @see useCon - React hook that provides access to the state container
 * @remarks
 * The useCon hook enables components to:
 * - Read state values
 * - Subscribe to state changes
 * - Trigger state updates
 * - Access history features
 */
export { useCon, } from './useCon';

/**
 * Represents an immutable history of state changes
 * @template S - The state type that extends DS (Data Structure)
 * @type {Immutable<History<S>>} - An immutable version of the History type for state S
 */
export type ConHistory<S extends DS,> = Immutable<History<S>>;
/**
 * Type representing the nested keys of a history state object
 * @template S - The state type that extends DS (Data Structure)
 * @type {NestedRecordKeys<HistoryState<S>>} - A type that extracts all possible nested key paths from the history state
 * @example
 * ```ts
 * // Given a state type:
 * type MyState = {
 *   user: { name: string, age: number }
 *   settings: { theme: string }
 * }
 * // ConHistoryStateKeys<MyState> would include paths like:
 * // 'user.name', 'user.age', 'settings.theme'
 * ```
 */
export type ConHistoryStateKeys<S extends DS,> = NestedRecordKeys<HistoryState<S>>;
/**
 * Represents nested keys of a history state as an array of strings
 * @template S - The state type that extends DS (Data Structure)
 * @type {NestedKeyArray<HistoryState<S>>} - Array representation of all possible nested key paths
 * @example
 * ```ts
 * // Given a state type:
 * type MyState = {
 *   user: { name: string, age: number }
 *   settings: { theme: string }
 * }
 * // ConHistoryStateKeysArray<MyState> would produce:
 * // ['user', 'name']
 * // ['user', 'age']
 * // ['settings', 'theme']
 * ```
 */
export type ConHistoryStateKeysArray<S extends DS,> = NestedKeyArray<HistoryState<S>>;
/**
 * Represents an immutable version of the state
 * @template S - The state type that extends DS (Data Structure)
 * @type {Immutable<S>} - Makes all properties and nested objects of the state readonly
 * @example
 * ```ts
 * type MyState = {
 *   count: number
 *   user: { name: string }
 * }
 * // ConState<MyState> becomes:
 * // {
 * //   readonly count: number
 * //   readonly user: { readonly name: string }
 * // }
 * ```
 */
export type ConState<S extends DS,> = Immutable<S>;
/**
 * Represents all possible nested key paths of the state object
 * @template S - The state type that extends DS (Data Structure)
 * @type {NestedRecordKeys<S>} - A type that extracts all possible nested key paths from the state
 * @example
 * // Given a state type:
 * type MyState = {
 *   user: { name: string, age: number }
 *   settings: { theme: string }
 * }
 * // ConStateKeys<MyState> would include paths like:
 * // 'user.name', 'user.age', 'settings.theme'
 */
export type ConStateKeys<S extends DS,> = NestedRecordKeys<S>;
/**
 * Represents the nested keys of a state object as an array
 * @template S - The state type that extends DS (Data Structure)
 * @type {NestedKeyArray<S>} - Array of strings representing the path to each nested property
 * @example
 * // Given a state type:
 * type MyState = {
 *   user: { name: string, profile: { age: number } }
 * }
 * // ConStateKeysArray<MyState> would produce:
 * // ['user']
 * // ['user', 'name']
 * // ['user', 'profile']
 * // ['user', 'profile', 'age']
 */
export type ConStateKeysArray<S extends DS,> = NestedKeyArray<S>;
