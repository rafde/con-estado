import { create, type Draft, isDraft, type Options as MutOptions, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { CreateConOptions, } from '../types/CreateConOptions';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { EstadoRecord, } from '../types/EstadoRecord';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { GetStringPathValue, } from '../types/GetStringPathValue';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import compareCallback, { type CompareCallbackReturn, } from './compareCallback';
import createArrayPathProxy from './createArrayPathProxy';
import createHistory from './createHistory';
import escapeDots from './escapeDots';
import findChanges from './findChanges';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepArrayPath from './getDeepArrayPath';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import isPlainObject from './isPlainObject';

function _joinPath( path: string | ( string | number )[], ) {
	return typeof path === 'string' ? path : path.map( escapeDots, ).join( '.', );
}

function handleStateUpdate<
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

function returnStateArgs( args: unknown[], ) {
	const [statePath, nextState,] = args;
	if ( typeof nextState === 'undefined' ) {
		return [
			'state',
			statePath,
		];
	}

	if ( typeof statePath === 'string' ) {
		return [
			`state.${statePath}`,
			nextState,
		];
	}

	if ( Array.isArray( statePath, ) ) {
		return [
			['state', ...statePath,],
			nextState,
		];
	}

	return [];
}

function _getDraft<
	State extends DS,
	M extends MutOptions<false, boolean> = MutOptions<false, false>,
>(
	history: EstadoHistory<State>,
	compare: CompareCallbackReturn<State>,
	setHistory: ( nextHistory: EstadoHistory<State>, ) => EstadoHistory<State>,
	arrayPathMap: Map<string | number, Array<string | number>>,
	stateHistoryPath?: unknown,
	mutOptions?: M,
) {
	const [
		_draft,
		_finalize,
	] = create(
		{
			initial: history.initial,
			state: history.state,
		},
		{
			...mutOptions,
		},
	);

	function finalize() {
		const next = _finalize();
		let {
			initial,
			state,
		} = next;

		const hasNoStateChanges = compare( history.state, state, 'state', ['state',], );
		const hasNoInitialChanges = compare( history.initial, initial, 'initial', ['initial',], );

		if ( hasNoStateChanges && hasNoInitialChanges ) {
			return history;
		}

		if ( hasNoStateChanges ) {
			state = history.state;
		}

		if ( hasNoInitialChanges ) {
			initial = history.initial;
		}

		const {
			changes,
		} = findChanges(
			initial as State,
			state as State,
			compare as CompareCallbackReturn,
		);
		const nextHistory: EstadoHistory<State> = {
			changes: changes as EstadoHistory<State>['changes'],
			priorInitial: initial !== history.initial ? history.initial : history.priorInitial,
			state: state as State,
			initial: initial as State,
			priorState: state !== history.state ? history.state : history.priorState,
		};

		return setHistory( nextHistory, );
	}

	const draft: Draft<{
		initial: State
		state: State
	}> = _draft;

	if ( typeof stateHistoryPath === 'string' ) {
		const value = getDeepArrayPath(
			_draft,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
		);
		if ( value == null || !isDraft( value, ) ) {
			throw new Error( `Key path ${stateHistoryPath} cannot be a draft. It's value is ${draft} of type ${typeof draft}`, );
		}
		return [
			value,
			finalize,
		] as const;
	}

	return [
		draft,
		finalize,
	] as const;
}

const opts = Object.freeze( {}, );
function noop(): void {
}

export default function createCon<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options: CreateConOptions<State, Acts> = opts as CreateConOptions<State, Acts>,
) {
	if ( initial == null || typeof initial !== 'object' ) {
		throw new Error( `createCon can only work with plain objects \`{}\` or arrays \`[]. Value is ${initial} of type ${typeof initial}`, );
	}
	let history = createHistory( { initial, }, );
	const {
		afterChange = noop,
		dispatcher = noop,
		mutOptions,
	} = options;
	const compare = compareCallback( options.compare, );
	const arrayPathMap = new Map<string | number, Array<string | number>>();

	function _dispatch( nextHistory: EstadoHistory<State>, ) {
		history = nextHistory;
		dispatcher( history as Immutable<EstadoHistory<State>>, );
		Promise.resolve().then( () => afterChange( history as Immutable<EstadoHistory<State>>, ), );
		return nextHistory;
	}

	function getDraft( stateHistoryPath: unknown = mutOptions, options = mutOptions, ) {
		const statePath = isPlainObject( stateHistoryPath, ) ? undefined : stateHistoryPath;
		const _mutOptions = isPlainObject( stateHistoryPath, ) ? stateHistoryPath : options;
		return _getDraft(
			history,
			compare,
			_dispatch,
			arrayPathMap,
			statePath,
			_mutOptions,
		);
	}

	function get<State extends DS, StateHistoryPath extends NestedRecordKeys<EstadoHistory<State>>,>(
		stateHistoryPath?: StateHistoryPath,
	): {
		readonly changes: Immutable<State extends ( infer U )[] ? ( U | undefined )[] : State extends EstadoRecord ? Partial<State> : never> | undefined
		readonly initial: Immutable<State>
		readonly priorState: Immutable<State> | undefined
		readonly priorInitial: Immutable<State> | undefined
		readonly state: Immutable<State>
	} | Immutable<GetStringPathValue<State, StateHistoryPath>> {
		if ( stateHistoryPath == null ) {
			// No argument version
			return history as Immutable<EstadoHistory<State>>;
		}
		return getDeepArrayPath(
			history,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
		) as Immutable<GetStringPathValue<State, typeof stateHistoryPath>>;
	}

	function setHistoryWrap( ...args: unknown[] ) {
		const [statePath, nextState,] = args;

		return function wrap( ...wrapArgs: unknown[] ) {
			const [draft, finalize,] = getDraft();
			if ( typeof statePath === 'function' ) {
				return handleStateUpdate(
					draft,
					history,
					[
						( ...props: unknown[] ) => statePath( props[ 0 ], ...wrapArgs, ),
					],
					arrayPathMap,
					finalize,
				);
			}

			if ( typeof nextState === 'function' ) {
				return handleStateUpdate(
					draft,
					history,
					[
						statePath,
						( ...props: unknown[] ) => nextState( props[ 0 ], ...wrapArgs, ),
					],
					arrayPathMap,
					finalize,
				);
			}

			return handleStateUpdate( draft, history, args, arrayPathMap, finalize, );
		};
	}

	function setHistory( ...args: unknown[] ) {
		const [draft, finalize,] = getDraft();

		if ( args.length === 0 ) {
			return finalize();
		}

		return handleStateUpdate( draft, history, args, arrayPathMap, finalize, );
	}

	const curryMap = new Map<unknown, ( nextState: unknown ) => EstadoHistory<State>>();
	function currySetHistory( statePath?: string | ( string | number )[], ) {
		if ( statePath == null ) {
			throw new Error( `curry methods accepts "string" or "Array<string | number>", path is ${statePath}`, );
		}

		const path = _joinPath( statePath, );
		const curryFn = curryMap.get( path, );
		if ( typeof curryFn === 'function' ) {
			return curryFn;
		}

		function curried( nextState: unknown, ) {
			return setHistory( statePath, nextState, );
		}

		curryMap.set( statePath, curried, );
		return curried;
	}

	const props: CreateActsProps<State> = {
		currySet( statePath: Parameters<CreateActsProps<State>['currySet']>[0], ) {
			const _statePath = Array.isArray( statePath, )
				? ['state', ...statePath,]
				: typeof statePath === 'string'
					? `state.${statePath}`
					: undefined;

			return currySetHistory( _statePath, );
		},
		currySetHistory,
		get,
		getDraft: getDraft as GetDraftRecord<State>['getDraft'],
		reset() {
			if ( history.changes == null ) {
				return history;
			}

			return _dispatch( {
				initial: history.initial,
				changes: undefined,
				priorInitial: history.priorInitial == null ? undefined : history.initial,
				priorState: history.priorState == null ? undefined : history.state,
				state: history.initial,
			}, );
		},
		set( ...args: unknown[] ) {
			return setHistory( ...returnStateArgs( args, ), );
		},
		setHistory,
		setHistoryWrap,
		setWrap( ...args: unknown[] ) {
			return setHistoryWrap( ...returnStateArgs( args, ), );
		},
	};

	return props;
}
