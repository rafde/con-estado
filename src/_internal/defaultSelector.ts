import type { ActRecord, } from '../types/ActRecord';
import type { DefaultSelector, } from '../types/DefaultSelector';
import type { DS, } from '../types/DS';

export default function defaultSelector<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown> | Record<never, never> = Record<never, never>,
>( selectorProps: Parameters<DefaultSelector<S, AR, SP>>[0], ) {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}
