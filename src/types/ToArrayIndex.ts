export type ToArrayIndex<T extends string | number, > = `${T}` extends `-${number}`
	? never
	: T extends '0'
		? 0
		: T extends `0${number}`
			? never
			: T extends `${infer N extends number}`
				? N extends number
					? number extends N
						? never
						: N
					: never
				: never;
