export type IsPlainObject<T,> = NonNullable<T> extends Record<string | number | symbol, unknown>
	? T extends Array<unknown>
		? false
		: T extends Date
			? false
			: T extends Set<unknown>
				? false
				: T extends Map<unknown, unknown>
					? false
					// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
					: T extends Function
						? false
						: T extends RegExp
							? false
							: true
	: false;
