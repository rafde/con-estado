import { strictDeepEqual, } from 'fast-equals';
import type { DS, } from '../types/DS';
import type { HistoryState, } from '../types/HistoryState';
import type { NestedKeyArray, } from '../types/NestedKeyArray';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { OptionCompare, } from '../types/OptionCompare';
import type { StringPathToArray, } from '../types/StringPathToArray';

export default function compareCallback<
	S extends DS,
>(
	compare?: OptionCompare<S>,
) {
	if ( typeof compare !== 'function' ) {
		return function cmp( previousValue: unknown, nextValue: unknown, ) {
			return strictDeepEqual( previousValue, nextValue, );
		};
	}
	return function cmp(
		previousValue: unknown,
		nextValue: unknown,
		key: NestedRecordKeys<S> | NestedRecordKeys<HistoryState<S>>,
		keys: NestedKeyArray<S> | StringPathToArray<NestedRecordKeys<HistoryState<S>>>,
	) {
		return Boolean( compare(
			previousValue,
			nextValue,
			{
				cmp: strictDeepEqual,
				key,
				keys,
			},
		), );
	};
}

export type CompareCallbackReturn<
	S extends DS = DS,
> = ReturnType<typeof compareCallback<S>>;
