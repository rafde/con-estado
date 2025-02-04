import { create, type Draft, isDraft, } from 'mutative';
import type { ActRecord, } from '../types/ActRecord';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { DS, } from '../types/DS';
import type { EstadoHistory, } from '../types/EstadoHistory';
import type { EstadoRecord, } from '../types/EstadoRecord';
import type { GetDraftRecord, } from '../types/GetDraftRecord';
import type { GetStringPathValue, } from '../types/GetStringPathValue';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { Option, } from '../types/Option';
import compareCallback, { type CompareCallbackReturn, } from './compareCallback';
import createArrayPathProxy from './createArrayPathProxy';
import createHistory from './createHistory';
import findChanges from './findChanges';
import getCacheStringPathToArray from './getCacheStringPathToArray';
import getDeepArrayPath from './getDeepArrayPath';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import noop from './noop';

const opts = Object.freeze( {}, );

export default function createCon<
	State extends DS,
	Acts extends ActRecord,
>(
	initial: State,
	options: Option<State, Acts> = opts as Readonly<Option<State, Acts>>,
) {
	if ( initial == null || typeof initial !== 'object' ) {
		throw new Error( `createCon can only work with plain objects \`{}\` or arrays \`[]. Value is ${initial} of type ${typeof initial}`, );
	}
	let history = createHistory( { initial, }, );
	const {
		afterChange = noop,
		dispatcher = noop,
	} = options;
	const compare = compareCallback( options.compare, );
	const arrayPathMap = new Map<string | number, Array<string | number>>();

	function setHistory( nextHistory: EstadoHistory<State>, ) {
		history = nextHistory;
		dispatcher( history as Immutable<EstadoHistory<State>>, );
		Promise.resolve().then( () => afterChange( history as Immutable<EstadoHistory<State>>, ), );
		return nextHistory;
	}

	function getDraft( stateHistoryPath: unknown, ) {
		const [
			_draft,
			_finalize,
		] = create(
			{
				initial: history.initial,
				state: history.state,
			},
			{ strict: true, },
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
				initial,
				state,
				compare as CompareCallbackReturn,
			);
			const nextHistory: EstadoHistory<State> = {
				changes: changes as EstadoHistory<State>['changes'],
				priorInitial: initial !== history.initial ? history.initial : history.priorInitial,
				state,
				initial,
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

	function _set( ...args: [targetStatePath?: 'state' | 'initial', unknown?, unknown?,] ) {
		const [
			targetStatePath,
			...props
		] = args;

		const [draft, finalize,] = getDraft( targetStatePath, );

		const [
			statePath,
			nextState,
		] = props;

		if ( props.length === 1 ) {
			if ( typeof statePath === 'function' ) {
				const callBackProps = {
					...history,
					draft,
				};
				statePath( callBackProps, );
			}
		}
		else if ( typeof statePath === 'string' || Array.isArray( statePath, ) ) {
			const arrayPath = ( typeof statePath === 'string' ? getCacheStringPathToArray( arrayPathMap, statePath, ) : statePath ) as string[];
			const penPath = arrayPath.at( -1, );
			const [
				value,
				parent,
			] = getDeepValueParentByArray( draft, arrayPath, );

			if ( typeof nextState === 'function' && value && typeof value === 'object' ) {
				nextState(
					createArrayPathProxy( value, history, arrayPath.slice( 1, ), ),
				);
			}
			else if ( parent && typeof parent === 'object' && typeof penPath !== 'undefined' && penPath in parent ) {
				if ( typeof nextState === 'function' ) {
					const result = nextState(
						createArrayPathProxy( parent, history, arrayPath.slice( 1, ), ),
					);
					Reflect.set( parent, penPath, result, );
				}
				else {
					Reflect.set( parent, penPath, nextState, );
				}
			}
		}

		return finalize();
	}

	const curryMap = new Map<unknown, ( nextState: unknown ) => EstadoHistory<State>>();

	const props: CreateActsProps<State> = {
		currySet( statePath: unknown, ) {
			const curryFn = curryMap.get( statePath, );
			if ( typeof curryFn === 'function' ) {
				return curryFn;
			}
			function curriedSet( nextState: unknown, ) {
				return _set( undefined, statePath, nextState, );
			}
			curryMap.set( statePath, curriedSet, );
			return curriedSet;
		},
		get<State extends DS, StateHistoryPath extends NestedRecordKeys<EstadoHistory<State>>,>(
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
		},
		getDraft: getDraft as GetDraftRecord<State>['getDraft'],
		reset() {
			if ( history.changes == null ) {
				return history;
			}

			return setHistory( {
				initial: history.initial,
				changes: undefined,
				priorInitial: history.priorInitial == null ? undefined : history.initial,
				priorState: history.priorState == null ? undefined : history.state,
				state: history.initial,
			}, );
		},
		set( ...args: unknown[] ) {
			return _set( undefined, ...args, );
		},
	};

	return props;
}
