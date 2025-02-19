// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export default function isFunction( value: unknown, ): value is Function {
	return typeof value === 'function';
}
