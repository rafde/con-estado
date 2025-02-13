import type { ActRecord, } from '../types/ActRecord';
import type { DefaultSelector, } from '../types/DefaultSelector';
import type { DS, } from '../types/DS';

export default function defaultSelector<
	S extends DS,
	AR extends ActRecord,
>( selectorProps: Parameters<DefaultSelector<S, AR>>[0], ): ReturnType<DefaultSelector<S, AR>> {
	return [
		selectorProps.state,
		selectorProps,
	] as const;
}
