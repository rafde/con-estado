import isNil from './isNil';

export default function isObject( value: unknown, ): value is object {
	return !isNil( value, ) && typeof value === 'object';
}
