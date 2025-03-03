import isNil from './isNil';

export default function isObj( value: unknown, ): value is object {
	return !isNil( value, ) && typeof value === 'object';
}
