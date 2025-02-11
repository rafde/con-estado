import type { Draft, } from 'mutative';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import createArrayPathProxy from './createArrayPathProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isPlainObject from './isPlainObject';

export default function handleStateUpdate<
	State extends DS,
>(
	draft: Draft<{
		initial: State
		state: State
	}>,
	history: EstadoHistory<State>,
	args: unknown[],
	arrayPathMap: Map<string | number, Array<string | number>>,
	finalize: () => EstadoHistory<State>,
) {
	const [statePath, nextState,] = args;

	// Handle function-based root update
	if ( typeof statePath === 'function' ) {
		const callBackProps = {
			...history,
			draft,
		};
		statePath( callBackProps, );
		return finalize();
	}

	// Handle path-based updates
	if ( typeof statePath === 'string' || Array.isArray( statePath, ) ) {
		const arrayPath = typeof statePath === 'string'
			? getCacheStringPathToArray( arrayPathMap, statePath, )
			: statePath as ( string | number )[];

		const valuePath = arrayPath.at( -1, );
		const [value, parent,] = getDeepValueParentByArray( draft, arrayPath, );

		if ( typeof nextState === 'function' && value && typeof value === 'object' ) {
			nextState(
				createArrayPathProxy(
					value,
					history,
					arrayPath.slice( 1, ),
					{
						parentDraft: parent,
						draftProp: valuePath,
					},
				),
			);
		}
		else if ( parent && typeof parent === 'object' && typeof valuePath !== 'undefined' && valuePath in parent ) {
			if ( typeof nextState === 'function' ) {
				nextState(
					createArrayPathProxy(
						parent,
						history,
						arrayPath.slice( 1, ),
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
