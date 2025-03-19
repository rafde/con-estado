import isObj from './isObj';

export default function isPlainObj( value: unknown, ): value is Record<string | number, unknown> {
	if ( !isObj( value, ) ) {
		return false;
	}
	const constructor = value?.constructor;
	return constructor === Object || constructor === undefined;
}
