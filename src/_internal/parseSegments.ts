type SegmentsType = Array<string | number>;

const SPLIT_DOT = /(?<!\\)\./g;
const SPLIT_BRACKET_IDX = /(?<!\\)\[(-?\d+)\]/;
const BRACKET_TEST = /(?<!\\)\[/;
const CLEAN_STRING = /\\(\[|\.)/g;

const EMPTY_ARRAY = Object.freeze( [], ) as unknown as SegmentsType;

function cleanString( str: string, ) {
	return str.replaceAll( CLEAN_STRING, '$1', );
}

function extractArraySegments( input: string[], ) {
	const result = [];
	for ( const str of input ) {
		if ( !str ) {
			continue;
		}
		if ( BRACKET_TEST.test( str, ) ) {
			return EMPTY_ARRAY;
		}

		const num = parseInt( str, 10, );
		if ( Number.isInteger( num, ) ) {
			result.push( num, );
			continue;
		}

		const clean = cleanString( str, );
		result.push( clean, );
	}
	return result;
}

const cache = new Map<string, SegmentsType>();

function handleExtract( str: string, handleEmpty = false, ) {
	const c = str.split( SPLIT_BRACKET_IDX, );
	if ( c.length > 1 ) {
		const extract = extractArraySegments( c, );
		if ( !extract.length ) {
			return EMPTY_ARRAY;
		}

		if ( handleEmpty && c[ 0 ] === '' ) {
			extract.unshift( '', );
		}

		return extract;
	}

	if ( BRACKET_TEST.test( str, ) ) {
		return EMPTY_ARRAY;
	}

	const clean = cleanString( str, );
	return [clean,];
}

export default function parseSegments( path: string, ) {
	if ( cache.has( path, ) ) {
		return cache.get( path, ) as SegmentsType;
	}

	if ( !path ) {
		cache.set( path, EMPTY_ARRAY, );
		return EMPTY_ARRAY;
	}

	const objPath = path.split( SPLIT_DOT, );
	const first = objPath.shift() as string;

	const segments = handleExtract( first, );
	if ( !segments.length ) {
		cache.set( path, EMPTY_ARRAY, );
		return EMPTY_ARRAY;
	}

	for ( const seg of objPath ) {
		const segs = handleExtract( seg, true, );
		if ( !segs.length ) {
			cache.set( path, EMPTY_ARRAY, );
			return EMPTY_ARRAY;
		}
		segments.push( ...segs, );
	}

	cache.set( path, segments, );
	return segments;
}
