export default function escapeDots( key: string | number, ) {
	if ( typeof key === 'string' ) {
		return key.replace( /(?<!\\)\./g, '\\\\.', );
	}
	return key;
}
