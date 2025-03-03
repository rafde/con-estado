export default function isStr( value: unknown, ): value is string {
	return typeof value === 'string';
}
