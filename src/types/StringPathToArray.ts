type ArrayIndex<
	Acc extends string,
	Index extends string,
	Tail extends string,
> = Index extends `${number}`
	? Acc extends ''
		? [number, Tail, undefined,]
		: Tail extends string
			? Tail extends ''
				? [Acc, number, undefined, ]
				: [Acc, number, Tail, ]
			: [Acc, number, undefined, ]
	: never;

type SplitAtFirstUnescapedBracket<
	Body extends string,
	Acc extends string = '',
> = Body extends `${infer Head}[${infer Index}]${infer Tail}`
	? Head extends `${infer B}\\`
		? SplitAtFirstUnescapedBracket<
			Tail,
			`${Acc}${B}[${Index}]`
		>
		: ArrayIndex<`${Acc}${Head}`, Index, Tail>
	: [`${Acc}${Body}`, undefined, undefined,];

// Main type utility
type StringBracketToArray<S extends string,> = SplitAtFirstUnescapedBracket<S> extends [infer Head, infer Index, infer Tail,]
	? Index extends string
		? Tail extends string
			? [Head, ...StringBracketToArray<Index>, ...StringBracketToArray<Tail>,]
			: Index extends ''
				? [Head,]
				: [Head, ...StringBracketToArray<Index>,]
		: Index extends number
			? Tail extends string
				? [Head, Index, ...StringBracketToArray<Tail>,]
				: Index extends ''
					? [Head,]
					: [Head, Index,]
			: Head extends string | number
				? [Head,]
				: never
	: [S,];

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
	? [Head, Shoulders,]
	: never;

export type StringPathToArray<T extends string,> = HeadAndShoulders<T> extends [infer First, infer Rest,]
	? First extends string
		? Rest extends string
			? [...StringBracketToArray<First>, ...StringPathToArray<Rest>,]
			: [...StringBracketToArray<First>,]
		: never
	: [...StringBracketToArray<T>,];
