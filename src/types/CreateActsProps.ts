import type { EstadoDS, } from './EstadoDS';
import type { EstadoHistory, } from './EstadoHistory';
import type { EstadoSetters, } from './EstadoSetters';
import type { GetDraftRecord, } from './GetDraftRecord';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { Immutable, } from './Immutable';
import type { NestedRecordKeys, } from './NestedRecordKeys';

export type CreateActsProps<
	State extends EstadoDS,
	Return extends EstadoHistory<State> | void,
> = {
	get(
		stateHistoryPath?: undefined
	): Immutable<EstadoHistory<State>>
	get<StateHistoryPath extends NestedRecordKeys<EstadoHistory<State>>,>(
		stateHistoryPath: StateHistoryPath
	): Immutable<GetStringPathValue<EstadoHistory<State>, StateHistoryPath>>
}
& GetDraftRecord<State>
& EstadoSetters<State, Return>;
