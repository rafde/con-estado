import splitPath from './splitPath';

export default function getCacheStringPathToArray( map: Map<string | number, ( string | number )[]>, stringPath: string | number, ) {
	const stringPathArray = map.get( stringPath, );
	if ( Array.isArray( stringPathArray, ) ) {
		return stringPathArray;
	}

	const arr = splitPath( stringPath, );

	map.set( stringPath, arr, );

	return arr;
}
