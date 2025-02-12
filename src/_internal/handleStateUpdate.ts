import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { History, } from '../types/History';
import createArrayPathProxy from './createArrayPathProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isPlainObject from './isPlainObject';

export default function handleStateUpdate<
	S extends DS,
>(
	draft: Draft<{
		initial: S
		state: S
	}>,
	history: History<S>,
	args: unknown[],
	arrayPathMap: Map<string | number, Array<string | number>>,
	finalize: () => History<S>,
) {
	const [statePath, nextState,] = args;

	// Handle function-based root update
	if ( typeof statePath === 'function' ) {
		statePath( {
			...history,
			draft,
		}, );
		return finalize();
	}

	// Handle path-based updates
	if ( typeof statePath === 'string' || Array.isArray( statePath, ) ) {
		const arrayPath = typeof statePath === 'string'
			? getCacheStringPathToArray( arrayPathMap, statePath, )
			: statePath as ( string | number )[];

		const valuePath = arrayPath.at( -1, );
		const [value, parent,] = getDeepValueParentByArray( draft, arrayPath, );
		const slicedPath = arrayPath.slice( 1, );

		if ( typeof nextState === 'function' && isPlainObject( value, ) ) {
			nextState(
				createArrayPathProxy(
					value,
					history,
					slicedPath,
					{
						parentDraft: parent,
						draftProp: valuePath,
					},
				),
			);
		}
		else if ( typeof parent === 'object' && typeof valuePath !== 'undefined' && valuePath in parent ) {
			if ( typeof nextState === 'function' ) {
				nextState(
					createArrayPathProxy(
						parent,
						history,
						slicedPath,
						{ valueProp: valuePath, },
					),
				);
			}
			else {
				Reflect.set( parent, valuePath, nextState, );
			}
		}
	}
	else if ( typeof nextState === 'undefined' && isPlainObject( statePath, ) ) {
		Object.assign( draft, statePath, );
	}

	return finalize();
}
