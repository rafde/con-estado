import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { Immutable, } from './Immutable';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { HistoryState, } from './HistoryState';
import type { StringPathToArray, } from './StringPathToArray';

type StringPathProps<
	S extends DS,
	NS extends HistoryState<S> | S,
	SP extends NestedRecordKeys<NS>,
> = Immutable<
	History<S> & {
		changesProp: GetStringPathValue<NS, SP> | undefined
		initialProp: GetStringPathValue<NS, SP>
		prevInitialProp: GetStringPathValue<NS, SP> | undefined
		prevProp: GetStringPathValue<NS, SP> | undefined
		stateProp: GetStringPathValue<NS, SP>
	}> & {
		draft: GetStringPathValue<NS, SP>
		historyDraft: Draft<HistoryState<S>>
	};

type ArrayPathProps<
	S extends DS,
	NS extends HistoryState<S> | S,
	SP extends StringPathToArray<NestedRecordKeys<NS>>,
> = Immutable<History<S> & {
	changesProp: GetArrayPathValue<NS, SP> | undefined
	initialProp: GetArrayPathValue<NS, SP>
	prevInitialProp: GetArrayPathValue<NS, SP> | undefined
	prevProp: GetArrayPathValue<NS, SP> | undefined
	stateProp: GetArrayPathValue<NS, SP>
}> & {
	draft: GetArrayPathValue<NS, SP>
	historyDraft: Draft<HistoryState<S>>
};

type CallbackHistoryDraftProps<
	S extends DS,
> = History<S> & Readonly<{
	historyDraft: Draft<HistoryState<S>>
}>;

type CallbackDraftProps<
	S extends DS,
> = CallbackHistoryDraftProps<S> & Readonly<{
	draft: Draft<S>
}>;

type SetHistory<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	setHistory(
		nextState: NS | ( (
			props: CallbackHistoryDraftProps<S>,
		) => void )
	): History<S>
	setHistory<
		SP extends RK,
	>(
		statePath: SP,
		nextState: GetStringPathValue<NS, SP> | (
			(
				props: StringPathProps<S, NS, SP>
			) => void
		),
	): History<S>
	setHistory<
		SP extends StringPathToArray<RK>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<NS, SP> | (
			(
				props: ArrayPathProps<S, NS, SP>
			) => void
		),
	): History<S>
};

type CurrySetHistory<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	currySetHistory<
		SP extends RK,
	>( statePath: SP, ): (
		nextState: GetStringPathValue<NS, SP> | (
			(
				props: StringPathProps<S, NS, SP>
			) => void
		)
	) => History<S>
	currySetHistory<
		SP extends StringPathToArray<RK>,
	>( statePath: SP, ): (
		nextState: GetArrayPathValue<NS, SP> | (
			(
				props: ArrayPathProps<S, NS, SP>
			) => void
		)
	) => History<S>
};

type SetHistoryWrap<
	S extends DS,
	NS extends HistoryState<S> = HistoryState<S>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	setHistoryWrap<A extends unknown[],>(
		nextState: (
			props: CallbackHistoryDraftProps<S>,
			...args: A
		) => void
	): ( ...args: A ) => History<S>
	setHistoryWrap<
		SP extends StringPathToArray<RK>,
		A extends unknown[],
	>(
		statePath: SP,
		nextState: (
			(
				props: ArrayPathProps<S, NS, SP>,
				...args: A
			) => void
		),
	): ( ...args: A ) => History<S>
	setHistoryWrap<
		SP extends RK,
		A extends unknown[],
	>(
		statePath: SP,
		nextState: (
			(
				props: StringPathProps<S, NS, SP>,
				...args: A
			) => void
		),
	): ( ...args: A ) => History<S>
};

type SetState<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	set(
		nextState: S | ( (
			props: CallbackDraftProps<S>,
		) => void )
	): History<S>
	set<
		SP extends RK,
	>(
		statePath: SP,
		nextState: GetStringPathValue<S, SP> | (
			(
				props: StringPathProps<S, S, SP>
			) => void
			),
	): History<S>
	set<
		SP extends StringPathToArray<RK>,
	>(
		statePath: SP,
		nextState: GetArrayPathValue<S, SP> | (
			(
				props: ArrayPathProps<S, S, SP>
			) => void
			),
	): History<S>
};

type CurrySet<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	currySet<
		SP extends NestedRecordKeys<S>,
	>( statePath: SP, ): (
		nextState: GetStringPathValue<S, SP> | (
			(
				props: StringPathProps<S, S, SP>
			) => void
			)
	) => History<S>
	currySet<
		SP extends StringPathToArray<RK>,
	>( statePath: SP, ): (
		nextState: GetArrayPathValue<S, SP> | (
			(
				props: ArrayPathProps<S, S, SP>
			) => void
			)
	) => History<S>
};

type SetWrap<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	setWrap<A extends unknown[],>(
		nextState: (
			props: CallbackDraftProps<S>,
			...args: A
		) => void
	): ( ...args: A ) => History<S>
	setWrap<
		SP extends StringPathToArray<RK>,
		A extends unknown[],
	>(
		statePath: SP,
		nextState: (
			(
				props: ArrayPathProps<S, S, SP>,
				...args: A
			) => void
		),
	): ( ...args: A ) => History<S>
	setWrap<
		SP extends NestedRecordKeys<S>,
		A extends unknown[],
	>(
		statePath: SP,
		nextState: (
			(
				props: StringPathProps<S, S, SP>,
				...args: A
			) => void
		),
	): ( ...args: A ) => History<S>
};

export type Setters<
	S extends DS,
> = {
	reset(): History<S>
}
& CurrySet<S>
& CurrySetHistory<S>
& SetHistory<S>
& SetHistoryWrap<S>
& SetState<S>
& SetWrap<S>;
