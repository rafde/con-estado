import type { DS, } from './types/DS';
import type { History, } from './types/History';
import type { HistoryState, } from './types/HistoryState';
import type { Immutable, } from './types/Immutable';
import type { NestedKeyArray, } from './types/NestedKeyArray';
import type { NestedRecordKeys, } from './types/NestedRecordKeys';

export { createConStore, } from './createConStore';
export { useCon, } from './useCon';

export type ConHistory<S extends DS,> = Immutable<History<S>>;

export type ConHistoryState<S extends DS,> = Immutable<History<S>>;
export type ConHistoryStateKeys<S extends DS,> = NestedRecordKeys<HistoryState<S>>;
export type ConHistoryStateKeysArray<S extends DS,> = NestedKeyArray<HistoryState<S>>;

export type ConState<S extends DS,> = Immutable<S>;
export type ConStateKeys<S extends DS,> = NestedRecordKeys<S>;
export type ConStateKeysArray<S extends DS,> = NestedKeyArray<S>;
