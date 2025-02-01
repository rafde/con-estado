import { strictDeepEqual, } from 'fast-equals';
import type { EstadoDS, } from '../types/EstadoDS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { NestedKeyArray, } from '../types/NestedKeyArray';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { OptionCompare, } from '../types/OptionCompare';
import type { StringPathToArray, } from '../types/StringPathToArray';

export default function compareCallback<
	State extends EstadoDS,
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
	State extends EstadoDS = EstadoDS,
> = ReturnType<typeof compareCallback<State>>;
