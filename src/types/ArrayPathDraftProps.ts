import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { StringPathToArray, } from './StringPathToArray';

export type ArrayPathDraftProps<
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
