import type { Draft, } from 'mutative';
import type { DeepPartial, } from './DeepPartial';
import type { DS, } from './DS';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';
import type { Immutable, } from './Immutable';
import type { Ops, } from './Ops';

export type GetDraftRecord<
	S extends DS,
> = {
	getDraft( opId: `${Ops}${number}` ): readonly [
		Draft<HistoryState<S>>,
		( type: Ops, opId: `${Ops}${number}` ) => History<S>,
		Immutable<DeepPartial<HistoryState<S>>>,
	]
};
