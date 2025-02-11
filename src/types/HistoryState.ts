import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';

export type HistoryState<S extends DS,> = Pick<EstadoHistory<S>, 'initial' | 'state'>;
