import { strictDeepEqual, } from 'fast-equals';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { NestedKeyArray, } from '../types/NestedKeyArray';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { OptionCompare, } from '../types/OptionCompare';
import type { StringPathToArray, } from '../types/StringPathToArray';

export default function compareCallback<
	State extends DS,
>(
	compare?: OptionCompare<State>,
) {
	if ( typeof compare !== 'function' ) {
		return function cmp( previousValue: unknown, nextValue: unknown, ) {
			return strictDeepEqual( previousValue, nextValue, );
		};
	}
	return function cmp(
		previousValue: unknown,
		nextValue: unknown,
		key: NestedRecordKeys<State> | NestedRecordKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
		keys: NestedKeyArray<State> | StringPathToArray<NestedRecordKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>>,
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
	State extends DS = DS,
> = ReturnType<typeof compareCallback<State>>;
