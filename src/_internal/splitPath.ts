function unescapeDots( path: string | number, ) {
	if ( typeof path === 'string' ) {
		return path.replace( /\\\./g, '.', );
	}

	return path;
}

export default function splitPath<Path extends string | number,>( path: Path, ) {
	if ( typeof path === 'number' ) {
		return [path,];
	}
	return path.split( /(?<!\\)\./, ).map( unescapeDots, );
}
