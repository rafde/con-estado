export default function splitPath<Path extends string,>( path: Path, ) {
	return path.split( /(?<!\\)\./, );
}
