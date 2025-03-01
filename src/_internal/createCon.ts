import { create, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { CreateConOptions, } from '../types/CreateConOptions';
import type { CreateConReturnType, } from '../types/CreateConReturnType';
import type { DS, } from '../types/DS';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { GetStringPathValue, } from '../types/GetStringPathValue';
import type { History, } from '../types/History';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import createArrayPathProxy from './createArrayPathProxy';
import createHistoryProxy from './createHistoryProxy';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import getHistoryDraft from './getHistoryDraft';
import handleStateUpdate from './handleStateUpdate';
import isFunction from './isFunction';
import isNil from './isNil';
import isObject from './isObject';
import isPlainObject from './isPlainObject';
import isString from './isString';
import isUndefined from './isUndefined';
import isValidStatePath from './isValidStatePath';

function _escapeDots( key: string | number, ) {
	if ( isString( key, ) ) {
		return key.replace( /(?<!\\)\./g, '\\\\.', );
	}
	return key;
}

const _isPromiseLike = <T,>( value: unknown, ): value is PromiseLike<T> => isObject( value, )
	&& 'then' in value && isFunction( value?.then, );

function _joinPath( path: string | ( string | number )[], ) {
	return isString( path, ) ? path : path.map( _escapeDots, ).join( '.', );
}

function _returnStateArgs( args: unknown[], ) {
	const [statePath, nextState,] = args;
	if ( isNil( nextState, ) ) {
		return [
			'state',
			statePath,
		];
	}

	if ( isString( statePath, ) ) {
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
	if ( !isObject( initial, ) ) {
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

	const getDraft: GetDraftRecord<S>['getDraft'] = ( stateHistoryPath = mutOptions, options = mutOptions, ) => {
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
	};

	function get<S extends DS, SHP extends NestedRecordKeys<History<S>>,>(
		stateHistoryPath?: SHP,
	): Immutable<History<S>> | Immutable<GetStringPathValue<S, SHP>> {
		if ( isNil( stateHistoryPath, ) ) {
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
		const isStatePathFunction = isFunction( statePath, );
		const isNextStateType = isFunction( nextState, );

		if ( !isStatePathFunction && !isNextStateType ) {
			throw new Error( 'Wrapper methods needs a callback function to wrap', );
		}

		const _isValidStatePath = isValidStatePath( statePath, );
		if ( _isValidStatePath && !isNextStateType ) {
			throw new Error( 'Wrapper method second parameter needs a callback function to wrap', );
		}

		return function wrap( ...wrapArgs: unknown[] ) {
			const [historyDraft, finalize,] = getDraft();
			let result: unknown;
			if ( isStatePathFunction ) {
				result = statePath(
					{
						...history,
						historyDraft,
					},
					...wrapArgs,
				);
			}
			else if ( _isValidStatePath && isNextStateType ) {
				const statePathArray = isString( statePath, )
					? getCacheStringPathToArray( arrayPathMap, statePath, )
					: statePath as ( string | number )[];
				const valueKey = statePathArray.at( -1, );
				const [, parentDraft,] = getDeepValueParentByArray( historyDraft, statePathArray, );
				if ( !isObject( parentDraft, ) || isUndefined( valueKey, ) || !( valueKey in parentDraft ) ) {
					return;
				}
				const pathArray = statePathArray.slice( 1, );
				result = nextState(
					createArrayPathProxy( {
						draft: parentDraft,
						historyDraft,
						pathArray,
						history,
						valueKey,
					}, ),
					...wrapArgs,
				);
			}

			if ( _isPromiseLike( result, ) ) {
				return result.then( ( res, ) => {
					finalize();
					return res;
				}, );
			}
			finalize();
			return result;
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
		if ( isNil( statePath, ) ) {
			throw new Error( `curry methods accepts "string" or "Array<string | number>", path is ${statePath}`, );
		}

		const path = _joinPath( statePath, );
		const curryFn = curryMap.get( path, );
		if ( isFunction( curryFn, ) ) {
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
				: isString( statePath, )
					? `state.${statePath}`
					: undefined;

			return currySetHistory( _statePath, );
		},
		currySetHistory,
		get,
		// getDraft: getDraft as GetDraftRecord<S>['getDraft'],
		reset() {
			if ( isNil( history.changes, ) ) {
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
						transform( {
							draft,
							history,
							type: 'reset',
							patches: {},
						}, );
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
				prev: isNil( history.prev, ) ? undefined : history.state,
				prevInitial: isNil( history.prevInitial, ) ? undefined : history.initial,
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
