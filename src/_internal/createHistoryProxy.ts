import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import findChanges from './findChanges';

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
				Reflect.set( history, prop, changes, );
				return changes;
			}

			return Reflect.get( history, prop, );
		},
		set() {
			return false;
		},
	}, );
}
