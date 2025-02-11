import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { Options as MutOptions, } from 'mutative';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { OptionCompare, } from './OptionCompare';
import type { DS, } from './DS';

export type Option<
	S extends DS,
	AR extends ActRecord,
	MO extends MutOptions<false, boolean> = MutOptions<false, false>,
> = {
	afterChange?: OptionAfterChange<S>
	acts?: CreateActs<S, AR>
	compare?: OptionCompare<S>
	mutOptions?: MO
};
