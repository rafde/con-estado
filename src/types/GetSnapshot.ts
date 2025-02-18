import type { ActRecord, } from './ActRecord';
import type { DS, } from './DS';
import type { History, } from './History';
import type { Immutable, } from './Immutable';
import type { SelectorProps, } from './SelectorProps';

export type GetSnapshot<
	S extends DS,
	AR extends ActRecord,
	SP extends Record<string, unknown> = Record<never, never>,
> = ( history: Immutable<History<S>> ) => SelectorProps<S, AR, SP>;
