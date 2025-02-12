const hrefSafeMap = new Map<string, string>();

export default function hrefSafe( str: string, ) {
	const s = hrefSafeMap.get( str, );
	if ( typeof s === 'string' ) {
		return s;
	}
	const _str = str.replaceAll( /[^a-zA-Z0-9\s-]/g, '', )
		.replaceAll( /\s/g, '-', )
		.toLocaleLowerCase();
	hrefSafeMap.set( str, _str, );
	return _str;
}
