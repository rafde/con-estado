import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { HistoryState, } from './HistoryState';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { MutOptions, } from './MutOptions';

export type GetDraftRecord<
	S extends DS,
	MO extends MutOptions = MutOptions,
> = {
	getDraft( stateHistoryPath?: MO, options?: never ): [
		Draft<HistoryState<S>>,
		() => History<S>,
	]
	getDraft<
		SHP extends NestedObjectKeys<HistoryState<S>>,
		MO extends MutOptions = MutOptions,
	>( stateHistoryPath: SHP, options?: MO ): [
		GetStringPathValue<
			Draft<HistoryState<S>>,
			SHP
		>,
		() => History<S>,
	]
};
