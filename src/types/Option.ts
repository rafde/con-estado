import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { OptionCompare, } from './OptionCompare';
import type { DS, } from './DS';

export type Option<
	State extends DS,
	Acts extends ActRecord,
> = {
	compare?: OptionCompare<State>
	afterChange?: OptionAfterChange<State>
	acts?: CreateActs<State, Acts>
};
