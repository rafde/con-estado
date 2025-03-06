type SplitAtFirstUnescapedDot<
	Body extends string,
	Acc extends string = '',
> = Body extends `${infer Head}.${infer Tail}`
	? Head extends `${infer B}\\`
		? SplitAtFirstUnescapedDot<
			Tail,
			`${Acc}${B}.`
		>
		: Tail extends string
			? [`${Acc}${Head}`, Tail,]
			: [`${Acc}${Head}`, undefined,]
	: [`${Acc}${Body}`, undefined,];

type HeadAndShoulders<
	Body extends string,
> = SplitAtFirstUnescapedDot<Body> extends [infer Head, infer Shoulders,]
	? Head extends `${number}`
		? [number, Shoulders,]
		: [Head, Shoulders,]
	: never;

export type StringPathToArray<T extends string,> = HeadAndShoulders<T> extends [infer First, infer Rest,]
	? First extends string | number
		? Rest extends string
			? [First, ...StringPathToArray<Rest>,]
			: [First,]
		: never
	: [T,];
