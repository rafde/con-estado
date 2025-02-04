export type StringPathToArray<T extends string,> = T extends `${infer First}\\.${infer Rest}`
	? [First, ...StringPathToArray<Rest>,]
	: T extends `${infer First}.${infer Rest}`
		? First extends `${number}`
			? [number, ...StringPathToArray<Rest>,]
			: [First, ...StringPathToArray<Rest>,]
		: T extends `${number}`
			? [number,]
			: [T,];
