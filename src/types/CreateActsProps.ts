import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { EstadoSetters, } from './EstadoSetters';
import type { GetDraftRecord, } from './GetDraftRecord';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { Immutable, } from './Immutable';
import type { NestedRecordKeys, } from './NestedRecordKeys';

export type CreateActsProps<
	S extends DS,
> = {
	get(
		stateHistoryPath?: undefined
	): Immutable<EstadoHistory<S>>
	get<SHP extends NestedRecordKeys<EstadoHistory<S>>,>(
		stateHistoryPath: SHP
	): Immutable<GetStringPathValue<EstadoHistory<S>, SHP>>
}
& GetDraftRecord<S>
& EstadoSetters<S>;
