function typeOf( value: unknown, type: 'object' | 'function' | 'string' | 'undefined', ): boolean {
	return typeof value === type;
}

export function isUndef( value: unknown, ): value is undefined {
	return typeOf( value, 'undefined', );
}

export function isNil( value: unknown, ): value is null | undefined {
	return value == null;
}

export function isObj( value: unknown, ): value is Record<string | number | symbol, unknown> {
	return !isNil( value, ) && typeOf( value, 'object', );
}

export function isPlainObj( value: unknown, ): value is object {
	if ( !isObj( value, ) ) {
		return false;
	}
	const constructor = value?.constructor;
	return constructor === Object || constructor === undefined;
}

export function isFunc( value: unknown, ): value is ( ...args: unknown[] ) => unknown {
	return typeOf( value, 'function', );
}

export function isStr( value: unknown, ): value is string {
	return typeOf( value, 'string', );
}
