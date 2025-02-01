import { create, type Draft, isDraft, } from 'mutative';
import compareCallback, { type CompareCallbackReturn, } from './_internal/compareCallback';
import createArrayPathProxy from './_internal/createArrayPathProxy';
import createHistory from './_internal/createHistory';
import findChanges from './_internal/findChanges';
import getCacheStringPathToArray from './_internal/getCacheStringPathToArray';
import getDeepArrayPath from './_internal/getDeepArrayPath';
import getDeepValueParentByArray from './_internal/getDeepValueParentByArray';
import noop from './_internal/noop';
import type { ActRecord, } from './types/ActRecord';
import type { CreateActs, } from './types/CreateActs';
import type { CreateActsProps, } from './types/CreateActsProps';
import type { EstadoDS, } from './types/EstadoDS';
import type { EstadoHistory, } from './types/EstadoHistory';
import type { EstadoRecord, } from './types/EstadoRecord';
import type { GetDraftRecord, } from './types/GetDraftRecord';
import type { GetStringPathValue, } from './types/GetStringPathValue';
import type { Immutable, } from './types/Immutable';
import type { NestedRecordKeys, } from './types/NestedRecordKeys';
import type { Option, } from './types/Option';

const frozenObj = Object.freeze( {}, );
const fo = <T,>() => frozenObj as T;
const opts = frozenObj;

export default function createEstado<
	State extends EstadoDS,
	Acts extends ActRecord,
>(
	initial: State,
	options?: Option<State> | CreateActs<State, Acts, EstadoHistory<State>>,
	createActs: CreateActs<State, Acts, EstadoHistory<State>> = fo,
) {
	if ( initial == null || typeof initial !== 'object' ) {
		throw new Error( `createEstado can only work with plain objects \`{}\` or arrays \`[]. Value is ${initial} of type ${typeof initial}`, );
	}
	let history = createHistory( { initial, }, );
	const _options = typeof options === 'object' ? options : opts as Readonly<Option<State>>;
	const _createActs = typeof options === 'function' ? options : createActs;
	const {
		afterChange = noop,
		dispatcher = noop,
	} = _options;
	const compare = compareCallback( _options?.compare, );
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
			else if ( parent && typeof parent === 'object' && penPath && penPath in parent ) {
				Reflect.set( parent, penPath, nextState, );
			}
		}

		return finalize();
	}

	const props: CreateActsProps<State, EstadoHistory<State>> = {
		get<State extends EstadoDS, StateHistoryPath extends NestedRecordKeys<EstadoHistory<State>>,>(
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

	const createActProps: CreateActsProps<State, EstadoHistory<State>> = {
		...props,

	};

	const acts = _createActs( createActProps, );

	return Object.freeze( {
		...props,
		acts,
	}, );
}
