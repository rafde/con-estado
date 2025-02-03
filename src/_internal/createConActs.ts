import type { ActRecord, } from '../types/ActRecord';
import type { CreateActs, } from '../types/CreateActs';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { DS, } from '../types/DS';

const frozenObj = Object.freeze( {}, );
const fo = <
	Acts extends ActRecord,
>() => frozenObj as Acts;

export default function createConActs<
	State extends DS,
	Acts extends ActRecord,
>( props: CreateActsProps<State>, acts: CreateActs<State, Acts> = fo, ) {
	return Object.freeze( {
		...props,
		acts: acts( props, ),
	}, );
}
