import { create, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { CreateConOptions, } from '../types/CreateConOptions';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { GetStringPathValue, } from '../types/GetStringPathValue';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import createHistory from './createHistory';
import escapeDots from './escapeDots';
import findChanges from './findChanges';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepArrayPath from './getDeepArrayPath';
import handleStateUpdate from './handleStateUpdate';
import isPlainObject from './isPlainObject';
import getHistoryDraft from './getHistoryDraft';

function _joinPath( path: string | ( string | number )[], ) {
	return typeof path === 'string' ? path : path.map( escapeDots, ).join( '.', );
}

function _returnStateArgs( args: unknown[], ) {
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

const EMPTY_OBJECT = Object.freeze( {}, );
function noop(): void {
}

const fo = <
	AR extends ActRecord,
>() => EMPTY_OBJECT as AR;

export type CreateConReturnType<
	S extends DS,
	AR extends ActRecord,
> = CreateActsProps<S> & { acts: AR };

export default function createCon<
	S extends DS,
	AR extends ActRecord,
>(
	initial: S,
	options: CreateConOptions<S, AR> = EMPTY_OBJECT as CreateConOptions<S, AR>,
): CreateConReturnType<S, AR> {
	if ( initial == null || typeof initial !== 'object' ) {
		throw new Error( `Only works with plain objects or arrays. Value is ${initial} of type ${typeof initial}`, );
	}
	let history = createHistory( { initial, }, );
	const {
		acts = fo,
		afterChange = noop,
		dispatcher = noop,
		transform = noop,
		mutOptions,
	} = options;
	const arrayPathMap = new Map<string | number, Array<string | number>>();

	function _dispatch( nextHistory: EstadoHistory<S>, ) {
		history = nextHistory;
		dispatcher( history as Immutable<EstadoHistory<S>>, );
		queueMicrotask( () => afterChange( history as Immutable<EstadoHistory<S>>, ), );
		return nextHistory;
	}

	function getDraft( stateHistoryPath: unknown = mutOptions, options = mutOptions, ) {
		const statePath = isPlainObject( stateHistoryPath, ) ? undefined : stateHistoryPath;
		const _mutOptions = isPlainObject( stateHistoryPath, ) ? stateHistoryPath : options;
		return getHistoryDraft(
			history,
			_dispatch,
			arrayPathMap,
			transform,
			'set',
			statePath,
			_mutOptions,
		);
	}

	function get<S extends DS, SHP extends NestedRecordKeys<EstadoHistory<S>>,>(
		stateHistoryPath?: SHP,
	): {
		readonly changes: Immutable<S extends ( infer U )[] ? ( U | undefined )[] : S extends Record<string | number, unknown> ? Partial<S> : never> | undefined
		readonly initial: Immutable<S>
		readonly priorState: Immutable<S> | undefined
		readonly priorInitial: Immutable<S> | undefined
		readonly state: Immutable<S>
	} | Immutable<GetStringPathValue<S, SHP>> {
		if ( stateHistoryPath == null ) {
			// No argument version
			return history as Immutable<EstadoHistory<S>>;
		}
		return getDeepArrayPath(
			history,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
		) as Immutable<GetStringPathValue<S, typeof stateHistoryPath>>;
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
						( prop: unknown, ) => statePath( prop, ...wrapArgs, ),
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
						( prop: unknown, ) => nextState( prop, ...wrapArgs, ),
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

	const curryMap = new Map<unknown, ( nextState: unknown ) => EstadoHistory<S>>();
	function currySetHistory( statePath?: string | ( string | number )[], ) {
		if ( statePath == null ) {
			throw new Error( `curry methods accepts "string" or "Array<string | number>", path is ${statePath}`, );
		}

		const path = _joinPath( statePath, );
		const curryFn = curryMap.get( path, );
		if ( typeof curryFn === 'function' ) {
			return curryFn;
		}

		const curried = ( nextState: unknown, ) => setHistory( statePath, nextState, );

		curryMap.set( statePath, curried, );
		return curried;
	}

	const props: CreateActsProps<S> = {
		currySet( statePath: Parameters<CreateActsProps<S>['currySet']>[0], ) {
			const _statePath = Array.isArray( statePath, )
				? ['state', ...statePath,]
				: typeof statePath === 'string'
					? `state.${statePath}`
					: undefined;

			return currySetHistory( _statePath, );
		},
		currySetHistory,
		get,
		getDraft: getDraft as GetDraftRecord<S>['getDraft'],
		reset() {
			if ( history.changes == null ) {
				return history;
			}

			let initial = history.initial;
			let state = history.initial;
			let changes: undefined | EstadoHistory<S>['changes'];
			if ( transform !== noop ) {
				let hasChanges = false;
				const res = create(
					{
						initial,
						state,
					},
					( draft, ) => {
						transform( draft, history, 'reset', );
					},
				);
				if ( res.initial !== initial ) {
					hasChanges = true;
					initial = res.initial;
				}
				if ( res.state !== state ) {
					hasChanges = true;
					state = res.state;
				}
				if ( hasChanges ) {
					changes = findChanges(
						initial,
						state,
					) as EstadoHistory<S>['changes'];
				}
			}

			return _dispatch( {
				initial,
				changes,
				priorInitial: history.priorInitial == null ? undefined : history.initial,
				priorState: history.priorState == null ? undefined : history.state,
				state,
			}, );
		},
		set( ...args: unknown[] ) {
			return setHistory( ..._returnStateArgs( args, ), );
		},
		setHistory,
		setHistoryWrap,
		setWrap( ...args: unknown[] ) {
			return setHistoryWrap( ..._returnStateArgs( args, ), );
		},
	};

	return Object.freeze( {
		...props,
		acts: acts( props, ),
	}, );
}
