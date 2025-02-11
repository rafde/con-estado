import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { HistoryState, } from './HistoryState';

export type OptionTransform<S extends DS,> = ( draft: Draft<HistoryState<S>>, history: EstadoHistory<S>, type: 'set' | 'reset' ) => void;
