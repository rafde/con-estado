import { create, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { CreateConOptions, } from '../types/CreateConOptions';
import type { CreateConReturnType, } from '../types/createConReturnType';
import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { GetStringPathValue, } from '../types/GetStringPathValue';
import type { History, } from '../types/History';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import createHistoryProxy from './createHistoryProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import getHistoryDraft from './getHistoryDraft';
import handleStateUpdate from './handleStateUpdate';
import isPlainObject from './isPlainObject';

function _escapeDots( key: string | number, ) {
	if ( typeof key === 'string' ) {
		return key.replace( /(?<!\\)\./g, '\\\\.', );
	}
	return key;
}

function _joinPath( path: string | ( string | number )[], ) {
	return typeof path === 'string' ? path : path.map( _escapeDots, ).join( '.', );
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
	let history: History<S> = createHistoryProxy( {
		initial,
		prev: undefined,
		prevInitial: undefined,
		state: initial,
	}, );
	const {
		acts = fo,
		afterChange = noop,
		dispatcher = noop,
		transform = noop,
		mutOptions,
	} = options;
	const arrayPathMap = new Map<string | number, Array<string | number>>();

	function _dispatch( nextHistory: History<S>, ) {
		history = nextHistory;
		dispatcher( history as Immutable<History<S>>, );
		queueMicrotask( () => afterChange( history as Immutable<History<S>>, ), );
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

	function get<S extends DS, SHP extends NestedRecordKeys<History<S>>,>(
		stateHistoryPath?: SHP,
	): Immutable<History<S>> | Immutable<GetStringPathValue<S, SHP>> {
		if ( stateHistoryPath == null ) {
			// No argument version
			return history as Immutable<History<S>>;
		}
		return getDeepValueParentByArray(
			history,
			getCacheStringPathToArray( arrayPathMap, stateHistoryPath, ),
		)[ 0 ] as Immutable<GetStringPathValue<S, typeof stateHistoryPath>>;
	}

	function setHistoryWrap( ...args: unknown[] ) {
		const [statePath, nextState,] = args;

		return function wrap( ...wrapArgs: unknown[] ) {
			const [draftHistory, finalize,] = getDraft();
			if ( typeof statePath === 'function' ) {
				return handleStateUpdate(
					draftHistory,
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
					draftHistory,
					history,
					[
						statePath,
						( prop: unknown, ) => nextState( prop, ...wrapArgs, ),
					],
					arrayPathMap,
					finalize,
				);
			}

			return handleStateUpdate( draftHistory, history, args, arrayPathMap, finalize, );
		};
	}

	function setHistory( ...args: unknown[] ) {
		const [draftHistory, finalize,] = getDraft();

		if ( args.length === 0 ) {
			return finalize();
		}

		return handleStateUpdate( draftHistory, history, args, arrayPathMap, finalize, );
	}

	const curryMap = new Map<unknown, ( nextState: unknown ) => History<S>>();
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
			if ( transform !== noop ) {
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
					initial = res.initial;
				}
				if ( res.state !== state ) {
					state = res.state;
				}
			}
			const nextHistory: History<S> = createHistoryProxy( {
				initial,
				prev: history.prev == null ? undefined : history.state,
				prevInitial: history.prevInitial == null ? undefined : history.initial,
				state,
			}, );

			return _dispatch( nextHistory, );
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
