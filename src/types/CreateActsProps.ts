import type { DS, } from './DS';
import type { History, } from './History';
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
	): Immutable<History<S>>
	get<SHP extends NestedRecordKeys<History<S>>,>(
		stateHistoryPath: SHP
	): Immutable<GetStringPathValue<History<S>, SHP>>
}
& GetDraftRecord<S>
& EstadoSetters<S>;
