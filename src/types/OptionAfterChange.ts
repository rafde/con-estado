import type { DS, } from './DS';
import type { History, } from './History';
import type { Immutable, } from './Immutable';

export type OptionAfterChange<
	S extends DS,
> = (
	history: Immutable<History<S>>,
) => Promise<void> | void;
