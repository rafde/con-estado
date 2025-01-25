export default function unescapeDots( path: string | number, ) {
	if ( typeof path === 'string' ) {
		return path.replace( /\\\./g, '.', );
	}

	return path;
}
