import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import getDeepArrayPath from './getDeepArrayPath';
import splitPath from './splitPath';
import unescapeDots from './unescapeDots';

export default function getDeepStringPath<
	State extends object,
	Path extends NestedRecordKeys<State> | string | number,
>( state: State, path: Path, ) {
	const segments = splitPath( path as string, );

	const [
		value,
	] = getDeepArrayPath(
		state,
		segments,
		unescapeDots,
	);

	return value;
}
