export default function isPlainObj( value: unknown, ): value is Record<string | number, unknown> {
	return value?.constructor === Object;
}
