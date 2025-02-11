import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { EstadoHistory, } from './EstadoHistory';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { StringPathToArray, } from './StringPathToArray';

export type ArrayPathDraftProps<
	S extends DS,
	TS extends DS,
	SP extends StringPathToArray<NestedObjectKeys<TS>>,
	Sub extends StringPathToArray<NestedObjectKeys<S>> = StringPathToArray<NestedObjectKeys<S>>,
> = {
	changesProp: GetArrayPathValue<EstadoHistory<S>['changes'], Sub>
	initialProp: GetArrayPathValue<EstadoHistory<S>['initial'], Sub>
	priorInitialProp: GetArrayPathValue<EstadoHistory<S>['priorInitial'], Sub>
	priorStateProp: GetArrayPathValue<EstadoHistory<S>['priorState'], Sub>
	stateProp: GetArrayPathValue<EstadoHistory<S>['state'], Sub>
} & Readonly<{
	draft: GetArrayPathValue<Draft<TS>, SP>
}> & EstadoHistory<S>;
