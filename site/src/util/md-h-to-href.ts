import childrenToString from './childrenToString';
import hrefSafe from './hrefSafe';

const toHrefMap = new Map<string | string[], string>();
export default function mdHToHref( str: string | string[], ): string {
	const _str = childrenToString( str, );
	const s = toHrefMap.get( _str, );
	if ( typeof s === 'string' ) {
		return s;
	}
	const href = hrefSafe( _str, );
	toHrefMap.set( str, href, );
	return href;
}
