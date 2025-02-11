function unescapeDots( path: string | number, ) {
	if ( typeof path === 'string' ) {
		return path.replace( /\\\./g, '.', );
	}

	return path;
}

export default function splitPath<P extends string | number,>( path: P, ) {
	if ( typeof path === 'number' ) {
		return [path,];
	}
	return path.split( /(?<!\\)\./, ).map( unescapeDots, );
}
