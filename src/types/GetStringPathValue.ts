type ToNumber<T extends string,> = T extends `${infer N extends number}` ? N : never;

export type SplitAtFirstUnescapedDot<
	Body extends string,
	A extends string = '',
> = Body extends `${infer Head}.${infer Tail}`
	? Head extends `${string}\\`
		? Head extends `${infer B}\\`
			? SplitAtFirstUnescapedDot<
				Tail,
				`${A}${B}.`
			>
			: never
		: Tail extends string ? [`${A}${Head}`, Tail,] : [`${A}${Head}`, undefined,]
	: [`${A}${Body}`, undefined,];

type HeadAndShoulders<
	Body extends string | number | symbol,
> = Body extends number
	? [Body, undefined,]
	: Body extends string
		? SplitAtFirstUnescapedDot<Body> extends [infer Head, infer Shoulders,]
			? [Head, Shoulders,]
			: Body extends `${infer H}.${infer S}`
				? [H, S,]
				: never
		: [Body, undefined,];

type Get<Obj, Head, Tail,> = Head extends keyof Obj
	? Obj[Head] extends Record<string | number, unknown> | Array<unknown>
		? Tail extends string | number
			? GetStringPathValue<Obj[Head], Tail>
			: Obj[Head]
		: Obj[Head]
	: Head extends `${number}`
		? Obj extends Array<infer U>
			? Tail extends string | number
				? GetStringPathValue<U, Tail>
				: U
			: never
		: never;

export type GetStringPathValue<Obj, Key extends string | number | symbol,> = HeadAndShoulders<Key> extends [
	infer Head,
	infer Shoulders,
]
	? Head extends keyof Obj
		? Get<Obj, Head, Shoulders>
		: Head extends `${number}`
			? Get<Obj, ToNumber<Head>, Shoulders>
			: never
	: never;
