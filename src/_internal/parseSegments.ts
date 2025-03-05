type SegmentsType = Array<string | number>;

const SPLIT_DOT = /(?<!\\)\./g;

const SPLIT_BRACKET = /(?<!\\)\[(\d+)\]/g;

const UNESCAPE_DOT = /\\\./g;
function unescapeDots( path: string, ) {
	return path.replaceAll( UNESCAPE_DOT, '.', );
}

const UNESCAPE_BRACKET = /\\\[/g;
function unescapeBracket( path: string, ) {
	return path.replaceAll( UNESCAPE_BRACKET, '[', );
}

function reJoinStringBrackets( arr: SegmentsType, ) {
	return arr.reduce( ( memo, v, ) => `${memo}${Number.isInteger( v, ) ? `[${v}]` : v}`, '', );
}

function arraySegments( arr: string[], ) {
	if ( arr.at( -1, ) ) {
		return [];
	}
	arr.pop();
	let res: SegmentsType = [];
	for ( const v of arr ) {
		if ( !v ) {
			continue;
		}
		if ( v[ 0 ] === '[' ) {
			res = [reJoinStringBrackets( [...res, v,], ),];
			continue;
		}
		const num = Number( v, );
		res.push( !isNaN( num, ) && num >= 0 ? num : unescapeBracket( v, ), );
	}

	return res;
}

function arrMapSegments( s: string, ) {
	if ( s[ 0 ] === '[' ) {
		return [unescapeBracket( s, ),];
	}
	const b = s.split( SPLIT_BRACKET, );
	const bSegs = arraySegments( b, );
	return bSegs.length ? bSegs : [unescapeBracket( s, ),];
}

const EMPTY_ARRAY = Object.freeze( [] as Readonly<SegmentsType>, );

const cache = new Map<string, Readonly<SegmentsType>>();

export default function parseSegments( path: string, ) {
	if ( cache.has( path, ) ) {
		return cache.get( path, ) as SegmentsType;
	}

	if ( !path ) {
		cache.set( path, EMPTY_ARRAY, );
		return EMPTY_ARRAY;
	}

	const a1 = path.split( SPLIT_DOT, )
		.map( unescapeDots, );

	let first: Array<string | number> = [];
	if ( a1[ 0 ][ 0 ] === '[' ) {
		const f1 = a1.shift() as string;
		const aSegs = arraySegments( f1.split( SPLIT_BRACKET, ), );
		first = aSegs.length ? aSegs : [unescapeBracket( f1, ),];
	}

	const a2 = a1.map( arrMapSegments, ).flat();

	const final = [...first, ...a2,] as const;
	cache.set( path, final, );
	return final;
}
