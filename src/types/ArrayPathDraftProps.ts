import type { Draft, } from 'mutative';
import type { DS, } from './DS';
import type { History, } from './History';
import type { GetArrayPathValue, } from './GetArrayPathValue';
import type { NestedObjectKeys, } from './NestedObjectKeys';
import type { StringPathToArray, } from './StringPathToArray';

export type ArrayPathDraftProps<
	S extends DS,
	TS extends DS,
	SP extends StringPathToArray<NestedObjectKeys<TS>>,
	Sub extends StringPathToArray<NestedObjectKeys<S>> = StringPathToArray<NestedObjectKeys<S>>,
> = {
	changesProp: GetArrayPathValue<History<S>['changes'], Sub>
	initialProp: GetArrayPathValue<History<S>['initial'], Sub>
	priorInitialProp: GetArrayPathValue<History<S>['priorInitial'], Sub>
	priorStateProp: GetArrayPathValue<History<S>['priorState'], Sub>
	stateProp: GetArrayPathValue<History<S>['state'], Sub>
} & Readonly<{
	draft: GetArrayPathValue<Draft<TS>, SP>
}> & History<S>;
