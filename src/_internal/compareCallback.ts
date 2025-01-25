import { strictDeepEqual, } from 'fast-equals';
import type { EstadoDS, } from '../types/EstadoDS';
import type { NestedKeyArray, } from '../types/NestedKeyArray';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { OptionCompare, } from '../types/OptionCompare';

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
	return function cmp( previousValue: unknown, nextValue: unknown, key: NestedRecordKeys<State>, keys: NestedKeyArray<State>, ) {
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
