import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';

export type GetDraftRecord<
	State extends DS,
> = {
	getDraft( stateHistoryPath?: undefined ): [
		Draft<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
		() => EstadoHistory<State>,
	]
	getDraft<
		StateHistoryPath extends NestedObjectKeys<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
	>( stateHistoryPath: StateHistoryPath ): [
		GetStringPathValue<
			Draft<Pick<EstadoHistory<State>, 'state' | 'initial'>>,
			StateHistoryPath
		>,
		() => EstadoHistory<State>,
	]
};
