import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import findChanges from './findChanges';
import { reflectGet, reflectSet, } from './reflect';

export default function createHistoryProxy<
	S extends DS,
>( history: History<S>, ) {
	return new Proxy( history, {
		get( _target, prop, ) {
			if ( prop === 'changes' && !( 'changes' in history ) ) {
				const changes = findChanges(
					history.initial,
					history.state,
				);
				reflectSet( history, prop, changes, );
				return changes;
			}

			return reflectGet( history, prop, );
		},
		set() {
			return false;
		},
	}, );
}
