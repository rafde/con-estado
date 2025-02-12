import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { HistoryState, } from './HistoryState';

export type OptionTransform<S extends DS,> = ( draft: Draft<HistoryState<S>>, history: History<S>, type: 'set' | 'reset' ) => void;
