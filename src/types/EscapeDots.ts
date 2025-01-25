import type { EstadoRecordKeyTypes, } from './EstadoRecordKeyTypes';

export type EscapeDots<S extends EstadoRecordKeyTypes,> = S extends `${infer F}.${infer R}`
	? `${F}\\.${EscapeDots<R>}`
	: `${S}`;
