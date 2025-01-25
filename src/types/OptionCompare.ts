import type { strictDeepEqual, } from 'fast-equals';
import type { EstadoDS, } from './EstadoDS';
import type { NestedKeyArray, } from './NestedKeyArray';
import type { NestedRecordKeys, } from './NestedRecordKeys';

/**
 * A `function` type for custom comparing the previous and next values of a hook state key.
 * Useful for the following scenarios:
 * - Custom equality logic by comparing only specific properties to optimize re-renders.
 * - Handle complex nested objects that need special comparison handling.
 * @template {EstadoDS} State - The {@link EstadoDS} hook state.
 * @param previous - A previous value.
 * @param next - A next value.
 * @param extra - An object containing additional parameters for the comparison:
 * @param extra.cmp - A comparison function using {@link import('fast-equals').strictDeepEqual strictDeepEqual}
 * from {@link import('fast-equals') fast-equals} library.
 * @param extra.key - string that leads to a nested state's value.
 * @param extra.keys - An array of keys that lead to a nested state's value.
 * @returns `true` if the previous and next values are considered equal, `false` otherwise.
 */
export type OptionCompare<State extends EstadoDS,> = (
	previousValue: unknown,
	nextValue: unknown,
	extra: {
		cmp: typeof strictDeepEqual
		key: NestedRecordKeys<State>
		keys: NestedKeyArray<State>
	}
) => boolean;
