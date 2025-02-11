export type EscapeDots<S extends string | number,> = S extends `${infer F}.${infer R}`
	? `${F}\\.${EscapeDots<R>}`
	: `${S}`;
