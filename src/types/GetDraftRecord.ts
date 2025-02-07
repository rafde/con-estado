import type { Draft, Options as MutOptions, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';

export type GetDraftRecord<
	State extends DS,
	M extends MutOptions<false, boolean> = MutOptions<false, false>,
> = {
	getDraft( stateHistoryPath?: M, options?: never ): [
		Draft<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
		() => EstadoHistory<State>,
	]
	getDraft<
		StateHistoryPath extends NestedObjectKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
		M extends MutOptions<false, boolean> = MutOptions<false, false>,
	>( stateHistoryPath: StateHistoryPath, options?: M ): [
		GetStringPathValue<
			Draft<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
			StateHistoryPath
		>,
		() => EstadoHistory<State>,
	]
};
