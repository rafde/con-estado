export default function isPlainObject( value: unknown, ): value is Record<string | number, unknown> {
	return value?.constructor === Object;
}
