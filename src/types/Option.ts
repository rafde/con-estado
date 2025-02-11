import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { Options as MutOptions, } from 'mutative';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { DS, } from './DS';

export type Option<
	S extends DS,
	AR extends ActRecord,
	MO extends MutOptions<false, boolean> = MutOptions<false, false>,
> = {
	acts?: CreateActs<S, AR>
	afterChange?: OptionAfterChange<S>
	mutOptions?: MO
};
