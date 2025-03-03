import isStr from './isStr';

export default function isValidStatePath( statePath: unknown, ) {
	return isStr( statePath, ) || Array.isArray( statePath, );
}
