import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import findChanges from './findChanges';

export default function createHistoryProxy<
	S extends DS,
>( history: History<S>, ) {
	return new Proxy( history as History<S>, {
		get( _target, propertyKey, ) {
			if ( propertyKey in history ) {
				return Reflect.get( history, propertyKey, );
			}

			if ( propertyKey === 'changes' ) {
				const changes = findChanges(
					history.initial,
					history.state,
				) as History<S>['changes'];
				Reflect.set( history, propertyKey, changes, );
				return changes;
			}
		},
		set() {
			return false;
		},
	}, );
}
