import isString from './isString';

export default function isValidStatePath( statePath: unknown, ) {
	return isString( statePath, ) || Array.isArray( statePath, );
}
