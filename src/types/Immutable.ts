export type Immutable<T,> = T extends ( infer R )[]
	? ReadonlyArray<Immutable<R>>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	: T extends Function
		? T
		: T extends object
			? { readonly [P in keyof T]: Immutable<T[P]> }
			: T;

export type DeepReadonlyArray<T,> = ReadonlyArray<DeepReadonly<T>>;

export type DeepReadonly<T,> = T extends ( infer R )[]
	? DeepReadonlyArray<R>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	: T extends Function
		? T
		: T extends object
			? { readonly [P in keyof T]: DeepReadonly<T[P]> }
			: T;
