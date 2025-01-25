import unescapeDots from './unescapeDots';

export default function splitPath<Path extends string | number,>( path: Path, ) {
	if ( typeof path === 'number' ) {
		return [path,];
	}
	return path.split( /(?<!\\)\./, ).map( unescapeDots, );
}
