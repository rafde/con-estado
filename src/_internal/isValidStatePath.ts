import isArray from './isArray';
import isStr from './isStr';

export default function isValidStatePath( statePath: unknown, ) {
	return isStr( statePath, ) || isArray( statePath, );
}
