function unescapeDots( path: string, ) {
	return path.replace( /\\\./g, '.', );
}

export default function getCacheStringPathToArray( map: Map<string | number, ( string | number )[]>, path: string | number, ) {
	const stringPathArray = map.get( path, );
	if ( Array.isArray( stringPathArray, ) ) {
		return stringPathArray;
	}

	const arr = typeof path === 'number'
		? [path,]
		: path.split( /(?<!\\)\./, ).map( unescapeDots, );

	map.set( path, arr, );

	return arr;
}
