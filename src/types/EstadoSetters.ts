import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { Immutable, } from './Immutable';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

type NextState<
	State extends DS,
> = Pick<EstadoHistory<State>, 'state' | 'initial'>;

type StringPathProps<
	State extends DS,
	NS extends NextState<State> | State,
	StatePath extends NestedRecordKeys<NS>,
> = Immutable<
	EstadoHistory<State> & {
		changesProp: GetStringPathValue<NS, StatePath> | undefined
		initialProp: GetStringPathValue<NS, StatePath>
		priorInitialProp: GetStringPathValue<NS, StatePath> | undefined
		priorStateProp: GetStringPathValue<NS, StatePath> | undefined
		stateProp: GetStringPathValue<NS, StatePath>
	}> & {
		draft: GetStringPathValue<NS, StatePath>
	};

type ArrayPathProps<
	State extends DS,
	NS extends NextState<State> | State,
	StatePath extends StringPathToArray<NestedRecordKeys<NS>>,
> = Immutable<EstadoHistory<State> & {
	changesProp: GetArrayPathValue<NS, StatePath> | undefined
	initialProp: GetArrayPathValue<NS, StatePath>
	priorInitialProp: GetArrayPathValue<NS, StatePath> | undefined
	priorStateProp: GetArrayPathValue<NS, StatePath> | undefined
	stateProp: GetArrayPathValue<NS, StatePath>
}> & {
	draft: GetArrayPathValue<NS, StatePath>
};

type CallbackDraftProps<
	State extends DS,
	NS extends NextState<State> | State,
> = EstadoHistory<State> & Readonly<{
	draft: Draft<NS>
}>;

type SetHistory<
	S extends DS,
	NS extends NextState<S> = NextState<S>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	setHistory(
		nextState: NS | ( (
			props: CallbackDraftProps<S, NS>,
		) => void )
	): EstadoHistory<S>
	setHistory<
		StatePath extends RK,
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<NS, StatePath> | (
			(
				props: StringPathProps<S, NS, StatePath>
			) => void
		),
	): EstadoHistory<S>
	setHistory<
		StatePath extends StringPathToArray<RK>,
	>(
		statePath: StatePath,
		nextState: GetArrayPathValue<NS, StatePath> | (
			(
				props: ArrayPathProps<S, NS, StatePath>
			) => void
		),
	): EstadoHistory<S>
};

type CurrySetHistory<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	currySetHistory<
		StatePath extends RK,
	>( statePath: StatePath, ): (
		nextState: GetStringPathValue<NS, StatePath> | (
			(
				props: StringPathProps<State, NS, StatePath>
			) => void
		)
	) => EstadoHistory<State>
	currySetHistory<
		StatePath extends StringPathToArray<RK>,
	>( statePath: StatePath, ): (
		nextState: GetArrayPathValue<NS, StatePath> | (
			(
				props: ArrayPathProps<State, NS, StatePath>
			) => void
		)
	) => EstadoHistory<State>
};

type SetHistoryWrap<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	setHistoryWrap<Args extends unknown[],>(
		nextState: (
			props: CallbackDraftProps<State, NS>,
			...args: Args
		) => void
	): ( ...args: Args ) => EstadoHistory<State>
	setHistoryWrap<
		StatePath extends StringPathToArray<RK>,
		Args extends unknown[],
	>(
		statePath: StatePath,
		nextState: (
			(
				props: ArrayPathProps<State, NS, StatePath>,
				...args: Args
			) => void
		),
	): ( ...args: Args ) => EstadoHistory<State>
	setHistoryWrap<
		StatePath extends RK,
		Args extends unknown[],
	>(
		statePath: StatePath,
		nextState: (
			(
				props: StringPathProps<State, NS, StatePath>,
				...args: Args
			) => void
		),
	): ( ...args: Args ) => EstadoHistory<State>
};

type SetState<
	S extends DS,
	RK extends NestedRecordKeys<S> = NestedRecordKeys<S>,
> = {
	set(
		nextState: S | ( (
			props: CallbackDraftProps<S, S>,
		) => void )
	): EstadoHistory<S>
	set<
		StatePath extends RK,
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<S, StatePath> | (
			(
				props: StringPathProps<S, S, StatePath>
			) => void
			),
	): EstadoHistory<S>
	set<
		StatePath extends StringPathToArray<RK>,
	>(
		statePath: StatePath,
		nextState: GetArrayPathValue<S, StatePath> | (
			(
				props: ArrayPathProps<S, S, StatePath>
			) => void
			),
	): EstadoHistory<S>
};

export type EstadoSetters<
	State extends DS,
> = {
	reset(): EstadoHistory<State>
}
& CurrySetHistory<State>
& SetHistory<State>
& SetHistoryWrap<State>
& SetState<State>;
