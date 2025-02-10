import type { Draft, } from 'mutative';
import type { ArrayPathDraftProps, } from './ArrayPathDraftProps';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { Immutable, } from './Immutable';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

type NextState<
	State extends DS,
> = Pick<EstadoHistory<State>, 'state' | 'initial'>;

type SubStringPath<
	State extends DS,
	Path,
> = Path extends `${'state' | 'initial'}.${infer Sub}`
	? Sub extends NestedObjectKeys<State>
		? Sub
		: never
	: never;

type GetStringPathPropValue<
	State extends DS,
	EHK extends keyof EstadoHistory<State>,
	Sub extends NestedObjectKeys<State>,
> = GetStringPathValue<
	EstadoHistory<State>[EHK],
	Sub
>;

type StringPathProps<
	State extends DS,
	NS extends NextState<State>,
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

type StringPathDraftProps<
	State extends DS,
	TargetState extends DS,
	StatePath extends NestedObjectKeys<TargetState>,
	Sub extends NestedObjectKeys<State>,
> = Immutable<
	EstadoHistory<State> & {
		changesProp: GetStringPathPropValue<State, 'changes', Sub>
		initialProp: GetStringPathValue<EstadoHistory<State>['initial'], Sub>
		priorInitialProp: GetStringPathValue<EstadoHistory<State>['priorInitial'], Sub>
		priorStateProp: GetStringPathValue<EstadoHistory<State>['priorState'], Sub>
		stateProp: GetStringPathValue<EstadoHistory<State>['state'], Sub>
	}> & Readonly<{
		draft: GetStringPathValue<Draft<TargetState>, StatePath>
	}>;

type SubArrayPath<
	State extends DS,
	Path,
> = Path extends ['state' | 'initial', ...infer Sub,]
	? Sub extends StringPathToArray<NestedObjectKeys<State>>
		? Sub
		: never
	: never;

type ArrayPathProps<
	State extends DS,
	NS extends NextState<State>,
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
	NS extends NextState<State>,
> = EstadoHistory<State> & Readonly<{
	draft: Draft<NS>
}>;

type EstadoSet<
	S extends DS,
	NS extends NextState<S> = NextState<S>,
	OK extends NestedObjectKeys<NS> = NestedObjectKeys<NS>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	set(
		nextState: NS | ( (
			props: CallbackDraftProps<S, NS>,
		) => void )
	): EstadoHistory<S>
	set<
		StatePath extends OK,
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<NS, StatePath> | (
			(
				props: StringPathDraftProps<
					S,
					NS,
					StatePath,
					SubStringPath<S, StatePath>
				>,
			) => void
		),
	): EstadoHistory<S>
	set<
		StatePath extends StringPathToArray<OK>,
	>(
		statePath: StatePath,
		nextState: GetArrayPathValue<NS, StatePath> | (
			(
				props: ArrayPathDraftProps<
					S,
					NS,
					StatePath,
					SubArrayPath<S, StatePath>
				>,
			) => void
		),
	): EstadoHistory<S>
	set<
		StatePath extends RK,
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<NS, StatePath> | (
			(
				props: StringPathProps<S, NS, StatePath>
			) => void
		),
	): EstadoHistory<S>
	set<
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

type EstadoCurrySet<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
	OK extends NestedObjectKeys<NS> = NestedObjectKeys<NS>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	currySet<
		StatePath extends OK,
	>( statePath: StatePath, ): (
		nextState: GetStringPathValue<NS, StatePath> | (
			(
				props: StringPathDraftProps<
					State,
					NS,
					StatePath,
					SubStringPath<State, StatePath>
				>,
			) => void
		)
	) => EstadoHistory<State>
	currySet<
		StatePath extends StringPathToArray<OK>,
	>( statePath: StatePath, ): (
		nextState: GetArrayPathValue<NS, StatePath> | (
			(
				props: ArrayPathDraftProps<
					State,
					NS,
					StatePath,
					SubArrayPath<State, StatePath>
				>,
			) => void
		),
	) => EstadoHistory<State>
	currySet<
		StatePath extends RK,
	>( statePath: StatePath, ): (
		nextState: GetStringPathValue<NS, StatePath> | (
			(
				props: StringPathProps<State, NS, StatePath>
			) => void
		)
	) => EstadoHistory<State>
	currySet<
		StatePath extends StringPathToArray<RK>,
	>( statePath: StatePath, ): (
		nextState: GetArrayPathValue<NS, StatePath> | (
			(
				props: ArrayPathProps<State, NS, StatePath>
			) => void
		)
	) => EstadoHistory<State>
};

type EstadoSetWrap<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
	OK extends NestedObjectKeys<NS> = NestedObjectKeys<NS>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	setWrap<Args extends unknown[],>(
		nextState: (
			props: CallbackDraftProps<State, NS>,
			...args: Args
		) => void
	): ( ...args: Args ) => EstadoHistory<State>
	setWrap<
		StatePath extends OK,
		Args extends unknown[],
	>(
		statePath: StatePath,
		nextState: (
			props: StringPathDraftProps<
				State,
				NS,
				StatePath,
				SubStringPath<State, StatePath>
			>,
			...args: Args
		) => void,
	): ( ...args: Args ) => EstadoHistory<State>
	setWrap<
		StatePath extends StringPathToArray<OK>,
		Args extends unknown[],
	>(
		statePath: StatePath,
		nextState: (
			props: ArrayPathDraftProps<
				State,
				NS,
				StatePath,
				SubArrayPath<State, StatePath>
			>,
			...args: Args
		) => void,
	): ( ...args: Args ) => EstadoHistory<State>
	setWrap<
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
	setWrap<
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

export type EstadoSetters<
	State extends DS,
> = {
	reset(): EstadoHistory<State>
}
& EstadoSet<State>
& EstadoCurrySet<State>
& EstadoSetWrap<State>;
