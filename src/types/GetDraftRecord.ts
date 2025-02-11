import type { Draft, Options as MutOptions, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { HistoryState, } from './HistoryState';
import type { NestedObjectKeys, } from './NestedObjectKeys';

export type GetDraftRecord<
	S extends DS,
	MO extends MutOptions<false, boolean> = MutOptions<false, false>,
> = {
	getDraft( stateHistoryPath?: MO, options?: never ): [
		Draft<HistoryState<S>>,
		() => EstadoHistory<S>,
	]
	getDraft<
		SHP extends NestedObjectKeys<HistoryState<S>>,
		MO extends MutOptions<false, boolean> = MutOptions<false, false>,
	>( stateHistoryPath: SHP, options?: MO ): [
		GetStringPathValue<
			Draft<HistoryState<S>>,
			SHP
		>,
		() => EstadoHistory<S>,
	]
};
