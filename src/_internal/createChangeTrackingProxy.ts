import { strictDeepEqual, } from 'fast-equals';
import isArray from './isArray';
import isObj from './isObj';

type ArrayPath = Array<string | symbol | number>;

const reflectSet = Reflect.set;

function applyTargetChange( propPath: ArrayPath, target: object, value: unknown, isDelete = false, ) {
	// Clone the property path to avoid mutating the input array
	let currentTarget = target; // Tracks the current target level
	let i = 0;
	const len = propPath.length;
	const end = len - 1;
	while ( i < len ) {
		const currentProp = propPath[ i ];

		if ( isDelete && !( currentProp in currentTarget ) ) {
			// If the property does not exist in changes, stop traversal
			return true;
		}

		// If we are at the last property in the path, set the value
		if ( i >= end ) {
			return isDelete
				? delete currentTarget[ currentProp as keyof typeof currentTarget ]
				: reflectSet( currentTarget, currentProp, value, );
		}

		currentTarget = currentTarget[ currentProp as keyof typeof currentTarget ];
		i++;
	}
}

function applyChange( propPath: ArrayPath, target: object, changes: object, value: unknown, ) {
	// Clone the property path to avoid mutating the input array
	let currentTarget = target; // Tracks the current target level
	let currentChanges = changes; // Tracks the current changes level

	let i = 0;
	const len = propPath.length;
	const end = len - 1;
	// Traverse the property path
	while ( i < len ) {
		const currentProp = propPath[ i ];

		// If we are at the last property in the path, set the value
		if ( i >= end ) {
			return reflectSet( currentChanges, currentProp, value, );
		}

		// Check if the property exists in `changes`. If not, initialize it based on the type in `target`.
		if ( !( currentProp in currentChanges ) ) {
			const targetValue = currentTarget[ currentProp as keyof typeof currentTarget ];

			reflectSet(
				currentChanges,
				currentProp,
				isArray( targetValue, ) ? [] : {},
			);
		}

		// Update the pointers to traverse deeper into `changes` and `target`
		currentChanges = currentChanges[ currentProp as keyof typeof currentChanges ];
		currentTarget = currentTarget[ currentProp as keyof typeof currentTarget ];
		i++;
	}
}

type TrackerProxyOptions = {
	target: object // The target object being proxied
	propPath: Array<string | number | symbol> // Array path for nested property tracking
	changes: object // Tracks changes as they happen
	valueWM: WeakMap<object, object> // WeakMap to store already proxied values
	parent: object // Parent object in case of nested proxies
	prop: string | number | symbol
};

/**
 * Handle property access with a proxy.
 * @param options - TrackerProxyOptions containing target, propPath, changes, valueWM, prop, and parent.
 * @returns The value of the property, proxied if it's an object.
 */
function handleProxyGet(
	options: TrackerProxyOptions,
) {
	const { target, propPath, changes, valueWM, parent, prop, } = options;

	// Access the value using Reflect
	const value = target[ prop as keyof typeof target ];

	// Return primitive or non-object values directly
	if ( !isObj( value, ) ) {
		return value;
	}

	// If the value is already proxied, return the existing proxy
	if ( valueWM.has( value, ) ) {
		return valueWM.get( value, );
	}

	// Otherwise, create a new proxy and store it in the WeakMap
	const proxy = trackerProxy( {
		target: value,
		propPath: [...propPath, prop,],
		changes,
		valueWM,
		parent: parent || target,
	}, );
	valueWM.set( value, proxy, );

	return proxy;
}

function trackerProxy( {
	target, propPath, changes, valueWM, parent,
}: {
	target: object
	propPath: ArrayPath
	changes: object
	valueWM: WeakMap<object, object>
	parent: object
}, ) {
	return new Proxy( target, {
		get( valueProxy, prop, ) {
			return handleProxyGet( {
				target,
				propPath,
				changes,
				valueWM,
				parent,
				prop,
			}, );
		},
		set( valueProxy, prop, value, ) {
			const path = [...propPath, prop,];
			if ( !strictDeepEqual( target[ prop as keyof typeof target ], value, ) ) {
				applyChange( path, parent, changes, value, );
			}
			applyTargetChange( path, parent, value, );
			return true;
		},
		deleteProperty( proxy, prop, ) {
			const path = [...propPath, prop,];
			applyTargetChange( path, changes, undefined, true, );
			applyTargetChange( path, parent, undefined, true, );
			return true;
		},
	}, );
}

export default function createDraftChangeTrackingProxy<S extends object,>( parent: S, ) {
	const changes = {};
	const valueWM = new WeakMap();

	const targetProxy = new Proxy( parent, {
		get( proxy, prop, ) {
			return handleProxyGet( {
				target: parent,
				propPath: [],
				changes,
				valueWM,
				parent,
				prop,
			}, );
		},
		set( proxy, prop, value, ) {
			if ( !strictDeepEqual( parent[ prop as keyof typeof parent ], value, ) ) {
				reflectSet( changes, prop, value, );
			}

			proxy[ prop as keyof typeof proxy ] = value;
			return true;
		},
		deleteProperty( proxy, prop, ) {
			delete changes[ prop as keyof typeof changes ];
			delete parent[ prop as keyof typeof parent ];
			return true;
		},
	}, );
	return [
		targetProxy,
		changes,
	] as const;
}
