import { strictDeepEqual, } from 'fast-equals';
import type { DS, } from '../types/DS';

type ArrayPath = Array<string | symbol | number>;

function applyTargetChange( propPath: ArrayPath, target: object, value: unknown, ) {
	// Clone the property path to avoid mutating the input array
	let currentTarget = target; // Tracks the current target level
	let i = 0;
	const len = propPath.length;
	const end = len - 1;
	while ( i < len ) {
		if ( currentTarget == null ) {
			// it should't get here. You can only make a nested change if the target has the nested value
			return false;
		}
		const currentProp = propPath[ i ];

		// If we are at the last property in the path, set the value
		if ( i >= end ) {
			return Reflect.set( currentTarget, currentProp, value, );
		}
		currentTarget = Reflect.get( currentTarget, currentProp, );
		i++;
	}
	return false;
}

export function applyChange( propPath: ArrayPath, target: object, changes: object, value: unknown, ) {
	// Clone the property path to avoid mutating the input array
	let currentTarget = target; // Tracks the current target level
	let currentChanges = changes; // Tracks the current changes level

	let i = 0;
	const len = propPath.length;
	const end = len - 1;
	// Traverse the property path
	while ( i < len ) {
		if ( currentTarget == null ) {
			// it should't get here. You can only make a nested change if the target has the nested value
			return false;
		}

		const currentProp = propPath[ i ];

		// If we are at the last property in the path, set the value
		if ( i >= end ) {
			return Reflect.set( currentChanges, currentProp, value, );
		}

		// Check if the property exists in `changes`. If not, initialize it based on the type in `target`.
		if ( !( currentProp in currentChanges ) ) {
			const targetValue = Reflect.get( currentTarget, currentProp, );

			// Initialize the corresponding type in the changes object
			if ( Array.isArray( targetValue, ) ) {
				Reflect.set( currentChanges, currentProp, [], );
			}
			else {
				Reflect.set( currentChanges, currentProp, {}, );
			}
		}

		// Update the pointers to traverse deeper into `changes` and `target`
		currentChanges = Reflect.get( currentChanges, currentProp, );
		currentTarget = Reflect.get( currentTarget, currentProp, );
		i++;
	}
	return false;
}

export function deleteChange( propPath: ArrayPath, changes: object, ) {
	let currentChanges = changes; // Tracks the current level in changes

	let i = 0;
	const len = propPath.length;
	const end = len - 1;
	// Traverse the property path
	while ( i < len ) {
		const currentProp = propPath[ i ];

		if ( !( currentProp in currentChanges ) ) {
			// If the property does not exist in changes, stop traversal
			return false;
		}

		if ( i >= end ) {
			return Reflect.deleteProperty( currentChanges, currentProp, );
		}

		currentChanges = Reflect.get( currentChanges, currentProp, );
		i++;
	}

	return true;
}

function trackerProxy( {
	target, propPath, changes, valueWM, parent,
}: {
	target: object
	propPath: ArrayPath
	changes: DS
	valueWM: WeakMap<object, object>
	parent: object
}, ) {
	return new Proxy( target, {
		get( valueProxy, p, ) {
			const value = Reflect.get( target, p, );
			if ( typeof value !== 'object' || value == null ) {
				return value;
			}
			if ( valueWM.has( value, ) ) {
				return valueWM.get( value, );
			}
			const proxy = trackerProxy( {
				target: value,
				propPath: [...propPath, p,],
				changes,
				valueWM,
				parent,
			}, );
			valueWM.set( value, proxy, );
			return proxy;
		},
		set( valueProxy, prop, value, ) {
			const path = [...propPath, prop,];
			const oldValue = Reflect.get( target, prop, );
			if ( !strictDeepEqual( oldValue, value, ) ) {
				applyChange( path, parent, changes, value, );
			}

			return applyTargetChange( path, parent, value, );
		},
		deleteProperty( proxy, prop, ) {
			const path = [...propPath, prop,];
			deleteChange( path, changes, );
			return deleteChange( path, proxy, );
		},
	}, );
}

export default function createDraftChangeTrackingProxy<S extends object,>( parent: S, ) {
	const changes = {};
	const valueWM = new WeakMap();

	const targetProxy = new Proxy( parent, {
		get( proxy, prop, ) {
			const target = Reflect.get( parent, prop, );
			if ( typeof target !== 'object' || target == null ) {
				return target;
			}

			if ( valueWM.has( target, ) ) {
				return valueWM.get( target, );
			}

			const valueProxy = trackerProxy( {
				target,
				propPath: [prop,],
				changes,
				valueWM,
				parent,
			}, );
			valueWM.set( target, valueProxy, );
			return valueProxy;
		},
		set( proxy, prop, value, ) {
			const oldValue = Reflect.get( parent, prop, );
			if ( !strictDeepEqual( oldValue, value, ) ) {
				Reflect.set( changes, prop, value, );
			}

			return Reflect.set( proxy, prop, value, );
		},
		deleteProperty( proxy, prop, ) {
			Reflect.deleteProperty( changes, prop, );
			return Reflect.deleteProperty( parent, prop, );
		},
	}, );
	return [
		targetProxy,
		changes,
	] as const;
}
