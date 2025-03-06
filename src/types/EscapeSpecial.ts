export type EscapeSpecial<S extends string | number,> = S extends `${infer F}.${infer R}`
	? `${F}\\.${EscapeSpecial<R>}`
	: S extends `${infer F}[${infer R}`
		? `${F}\\[${EscapeSpecial<R>}`
		: `${S}`;
