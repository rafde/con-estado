import type { Draft, } from 'mutative';
import type { ArrayPathDraftProps, } from '../types/ArrayPathDraftProps';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { NestedObjectKeys, } from '../types/NestedObjectKeys';
import type { StringPathToArray, } from '../types/StringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';

export default function createArrayPathProxy<
	S extends DS,
	TS extends object,
>(
	targetState: TS,
	history: EstadoHistory<S>,
	arrayPath: ( string | number )[],
	props: {
		draftProp?: string | number
		parentDraft?: Draft<unknown>
		valueProp?: never
	} | {
		draftProp?: never
		parentDraft?: never
		valueProp?: string | number
	} = {},
) {
	const {
		draftProp,
		parentDraft,
		valueProp,
	} = props;
	return new Proxy(
		{
			...history,
			draft: targetState,
		} as ArrayPathDraftProps<S, DS, StringPathToArray<NestedObjectKeys<DS>>>,
		{
			get( target, prop, ) {
				switch ( prop ) {
					case 'changesProp': {
						const [
							prop,
						] = getDeepValueParentByArray( history.changes, arrayPath, );
						target.changesProp = prop as never;
						return prop;
					}
					case 'initialProp': {
						const [
							prop,
						] = getDeepValueParentByArray( history.initial, arrayPath, );
						target.initialProp = prop as never;
						return prop;
					}
					case 'priorInitialProp': {
						const [
							prop,
						] = getDeepValueParentByArray( history.priorInitial, arrayPath, );
						target.priorInitialProp = prop as never;
						return prop;
					}
					case 'priorStateProp': {
						const [
							prop,
						] = getDeepValueParentByArray( history.priorState, arrayPath, );
						target.priorStateProp = prop as never;
						return prop;
					}
					case 'stateProp': {
						const [
							prop,
						] = getDeepValueParentByArray( history.state, arrayPath, );
						target.stateProp = prop as never;
						return prop;
					}
					case 'draft': {
						if ( typeof valueProp !== 'undefined' ) {
							return Reflect.get( target.draft, valueProp, );
						}
						return Reflect.get( target, prop, );
					}
					default:
						return Reflect.get( target, prop, );
				}
			},
			set( target, prop, value, ) {
				if ( prop === 'draft' ) {
					if ( typeof valueProp !== 'undefined' ) {
						return Reflect.set( target.draft, valueProp, value, );
					}
					if ( parentDraft && typeof parentDraft === 'object' && typeof draftProp !== 'undefined' ) {
						return Reflect.set( parentDraft, draftProp, value, );
					}
					return Reflect.set( target, prop, value, );
				}
				return false;
			},
		},
	);
}
