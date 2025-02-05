import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { GetStringPathValue, } from './GetStringPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { NestedRecordKeys, } from './NestedRecordKeys';
import type { StringPathToArray, } from './StringPathToArray';

type SubArrayPath<
	State extends DS,
	Path,
> = Path extends ['state' | 'initial', ...infer Sub,]
	? Sub extends StringPathToArray<NestedObjectKeys<State>>
		? Sub
		: never
	: never;

export type StateArrayPathProps<
	State extends DS,
	TargetState extends DS,
	StatePath extends StringPathToArray<NestedObjectKeys<TargetState>>,
	Sub extends StringPathToArray<NestedObjectKeys<State>> = StringPathToArray<NestedObjectKeys<State>>,
> = {
	changesProp: GetArrayPathValue<EstadoHistory<State>['changes'], Sub>
	initialProp: GetArrayPathValue<EstadoHistory<State>['initial'], Sub>
	priorInitialProp: GetArrayPathValue<EstadoHistory<State>['priorInitial'], Sub>
	priorStateProp: GetArrayPathValue<EstadoHistory<State>['priorState'], Sub>
	stateProp: GetArrayPathValue<EstadoHistory<State>['state'], Sub>
} & Readonly<{
	draft: GetArrayPathValue<Draft<TargetState>, StatePath>
}> & EstadoHistory<State>;

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

type NextStateStringPathProps<
	State extends DS,
	TargetState extends DS,
	StatePath extends NestedObjectKeys<TargetState>,
	Sub extends NestedObjectKeys<State>,
> = {
	changesProp: GetStringPathPropValue<State, 'changes', Sub>
	initialProp: GetStringPathValue<EstadoHistory<State>['initial'], Sub>
	priorInitialProp: GetStringPathValue<EstadoHistory<State>['priorInitial'], Sub>
	priorStateProp: GetStringPathValue<EstadoHistory<State>['priorState'], Sub>
	stateProp: GetStringPathValue<EstadoHistory<State>['state'], Sub>
} & Readonly<{
	draft: GetStringPathValue<Draft<TargetState>, StatePath>
}>
& EstadoHistory<State>;

type StringPathProps<
	State extends DS,
	NS extends NextState<State>,
	StatePath extends NestedRecordKeys<NS>,
> = {
	changesProp: GetStringPathValue<NS, StatePath> | undefined
	initialProp: GetStringPathValue<NS, StatePath>
	priorInitialProp: GetStringPathValue<NS, StatePath> | undefined
	priorStateProp: GetStringPathValue<NS, StatePath> | undefined
	stateProp: GetStringPathValue<NS, StatePath>
};

type ArrayPathProps<
	State extends DS,
	NS extends NextState<State>,
	StatePath extends StringPathToArray<NestedRecordKeys<NS>>,
> = {
	changesProp: GetArrayPathValue<NS, StatePath> | undefined
	initialProp: GetArrayPathValue<NS, StatePath>
	priorInitialProp: GetArrayPathValue<NS, StatePath> | undefined
	priorStateProp: GetArrayPathValue<NS, StatePath> | undefined
	stateProp: GetArrayPathValue<NS, StatePath>
};

type NextState<
	State extends DS,
> = Pick<EstadoHistory<State>, 'state' | 'initial'>;

type EstadoSet<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
	OK extends NestedObjectKeys<NS> = NestedObjectKeys<NS>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	set(
		nextState: NS
	): EstadoHistory<State>
	set(
		nextState: (
			props: EstadoHistory<State>
				& Readonly<{
					draft: Draft<NS>
				}>,
		) => void
	): EstadoHistory<State>
	set<
		StatePath extends OK,
	>(
		statePath: StatePath,
		nextState: (
			props: NextStateStringPathProps<
				State,
				NS,
				StatePath,
				SubStringPath<State, StatePath>
			>,
		) => void,
	): EstadoHistory<State>
	set<
		StatePath extends StringPathToArray<OK>,
	>(
		statePath: StatePath,
		nextState: (
			props: StateArrayPathProps<
				State,
				NS,
				StatePath,
				SubArrayPath<State, StatePath>
			>,
		) => void,
	): EstadoHistory<State>
	set<
		StatePath extends StringPathToArray<RK>,
	>(
		statePath: StatePath,
		nextState: GetArrayPathValue<NS, StatePath> | (
			(
				props: ArrayPathProps<State, NS, StatePath>
			) => GetArrayPathValue<NS, StatePath> ),
	): EstadoHistory<State>
	set<
		StatePath extends RK,
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<NS, StatePath> | ( (
			props: EstadoHistory<State> & StringPathProps<State, NS, StatePath>
		) => GetStringPathValue<NS, StatePath> ),
	): EstadoHistory<State>
};

type EstadoCurrySet<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
	OK extends NestedObjectKeys<NS> = NestedObjectKeys<NS>,
	RK extends NestedRecordKeys<NS> = NestedRecordKeys<NS>,
> = {
	currySet<
		StatePath extends RK,
	>( statePath: StatePath, ): (
		( nextState: GetStringPathValue<NS, StatePath> | ( (
			props: EstadoHistory<State> & StringPathProps<State, NS, StatePath>
		) => GetStringPathValue<NextState<State>, StatePath> ) ) => EstadoHistory<State>
	)
	currySet<
		StatePath extends OK,
	>( statePath: StatePath, ): ( (
		nextState: (
			props: NextStateStringPathProps<
				State,
				NS,
				StatePath,
				SubStringPath<State, StatePath>
			>,
		) => void
	) => EstadoHistory<State> )
	currySet<
		StatePath extends StringPathToArray<OK>,
	>( statePath: StatePath, ): (
		nextState: (
			props: StateArrayPathProps<
				State,
				NS,
				StatePath,
				SubArrayPath<State, StatePath>
			>,
		) => void,
	) => EstadoHistory<State>
	currySet<
		StatePath extends StringPathToArray<RK>,
	>( statePath: StatePath, ): (
		nextState: GetArrayPathValue<NS, StatePath> | (
		(
			props: ArrayPathProps<State, NS, StatePath>
		) => GetArrayPathValue<NS, StatePath> )
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
			props: EstadoHistory<State>
				& Readonly<{
					draft: Draft<NS>
				}>,
			...args: Args
		) => void
	): ( ...args: Args ) => ( EstadoHistory<State> | PromiseLike<EstadoHistory<State>> )
	setWrap<
		StatePath extends OK,
		Args extends unknown[],
	>(
		statePath: StatePath,
		nextState: (
			props: NextStateStringPathProps<
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
			props: StateArrayPathProps<
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
			) => GetArrayPathValue<NS, StatePath> ),
	): ( ...args: Args ) => EstadoHistory<State>
	setWrap<
		StatePath extends RK,
		Args extends unknown[],
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<NS, StatePath> | ( (
			props: EstadoHistory<State> & StringPathProps<State, NS, StatePath>,
			...args: Args
		) => GetStringPathValue<NS, StatePath> ),
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
