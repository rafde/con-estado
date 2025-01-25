import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import splitPath from './splitPath';

export default function getDeepStringPath<
	State extends object,
	Path extends NestedRecordKeys<State> | string | number,
>( state: State, path: Path, ) {
	const segments = splitPath( path as string, );

	const [
		value,
	] = getDeepValueParentByArray(
		state,
		segments,
	);

	return value;
}
