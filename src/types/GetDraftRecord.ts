import type { Draft, Options as MutOptions, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';

export type GetDraftRecord<
	S extends DS,
	MO extends MutOptions<false, boolean> = MutOptions<false, false>,
> = {
	getDraft( stateHistoryPath?: MO, options?: never ): [
		Draft<Pick<EstadoHistory<S>, 'state' | 'initial'>>,
		() => EstadoHistory<S>,
	]
	getDraft<
		SHP extends NestedObjectKeys<Pick<EstadoHistory<S>, 'state' | 'initial'>>,
		MO extends MutOptions<false, boolean> = MutOptions<false, false>,
	>( stateHistoryPath: SHP, options?: MO ): [
		GetStringPathValue<
			Draft<Pick<EstadoHistory<S>, 'state' | 'initial'>>,
			SHP
		>,
		() => EstadoHistory<S>,
	]
};
