import type { ActRecord, } from './ActRecord';
import type { CreateActs, } from './CreateActs';
import type { MutOptions, } from './MutOptions';
import type { OptionAfterChange, } from './OptionAfterChange';
import type { DS, } from './DS';
import type { OptionTransform, } from './OptionTransform';

export type Option<
	S extends DS,
	AR extends ActRecord,
	MO extends MutOptions = MutOptions,
> = {
	acts?: CreateActs<S, AR>
	afterChange?: OptionAfterChange<S>
	mutOptions?: MO
	transform?: OptionTransform<S>
};
