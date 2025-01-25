import getDeepValueParentByArray from './getDeepValueParentByArray';

export default function getDeepArrayPath<
	State extends object,
	ArrayPath extends Array<string | number>,
>( state: State, arrayPath: ArrayPath, ) {
	const [
		value,
	] = getDeepValueParentByArray(
		state,
		arrayPath,
	);

	return value;
}
