import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { Options as MutOptions, } from 'mutative';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { OptionCompare, } from './OptionCompare';
import type { DS, } from './DS';

export type Option<
	State extends DS,
	Acts extends ActRecord,
	M extends MutOptions<false, boolean> = MutOptions<false, false>,
> = {
	afterChange?: OptionAfterChange<State>
	acts?: CreateActs<State, Acts>
	compare?: OptionCompare<State>
	mutOptions?: M
};
