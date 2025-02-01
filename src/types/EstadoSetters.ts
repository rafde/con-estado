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

type NextState<
	State extends DS,
> = Pick<EstadoHistory<State>, 'state' | 'initial'>;

type EstadoSet<
	State extends DS,
	NS extends NextState<State> = NextState<State>,
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
		StatePath extends NestedObjectKeys<NS>,
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
		StatePath extends StringPathToArray<NestedRecordKeys<NS>>,
	>(
		statePath: StatePath,
		nextState: GetArrayPathValue<NextState<State>, StatePath>,
	): EstadoHistory<State>
	set<
		StatePath extends StringPathToArray<NestedObjectKeys<NS>>,
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
		StatePath extends NestedRecordKeys<NS>,
	>(
		statePath: StatePath,
		nextState: GetStringPathValue<NS, StatePath>,
	): EstadoHistory<State>
};

export type EstadoSetters<
	State extends DS,
> = {
	reset(): EstadoHistory<State>
} & EstadoSet<State>;
