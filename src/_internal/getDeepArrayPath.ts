import getDeepValueParentByArray from './getDeepValueParentByArray';

export default function getDeepArrayPath<
	S extends object,
	AP extends Array<string | number>,
>( state: S, arrayPath: AP, ) {
	const [
		value,
	] = getDeepValueParentByArray(
		state,
		arrayPath,
	);

	return value;
}
