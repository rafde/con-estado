import type { DS, } from './DS';
import type { History, } from './History';

export type HistoryState<S extends DS,> = Pick<History<S>, 'initial' | 'state'>;
