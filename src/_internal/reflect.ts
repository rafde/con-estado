export function reflectSet( target: object, prop: string | symbol | number, value: unknown, ) {
	return Reflect.set( target, prop, value, );
}

export function reflectGet( target: object, prop: string | symbol | number, ) {
	return Reflect.get( target, prop, );
}
