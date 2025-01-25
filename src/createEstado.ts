import { create, } from 'mutative';
import compareCallback, { type CompareCallbackReturn, } from './_internal/compareCallback';
import { createArrayPathProxy, } from './_internal/createArrayPathProxy';
import createHistory from './_internal/createHistory';
import findChanges from './_internal/findChanges';
import getDeepStringPath from './_internal/getByStringPath';
import getDeepArrayPath from './_internal/getDeepArrayPath';
import noop from './_internal/noop';
import splitPath from './_internal/splitPath';
import type { ActRecord, } from './types/ActRecord';
import type { CreateActsProps, } from './types/CreateActsProps';
import type { EstadoDS, } from './types/EstadoDS';
import type { EstadoHistory, } from './types/EstadoHistory';
import type { EstadoProps, } from './types/EstadoProps';
import type { EstadoRecord, } from './types/EstadoRecord';
import type { GetDraftRecord, } from './types/GetDraftRecord';
import type { GetStringPathValue, } from './types/GetStringPathValue';
import type { Immutable, } from './types/Immutable';
import type { NestedRecordKeys, } from './types/NestedRecordKeys';
import type { Option, } from './types/Option';

export default function createEstado<
	State extends EstadoDS,
	Acts extends ActRecord,
	Opt extends Option<State, Acts>,
>( initial: State, options?: Opt, ): EstadoProps<
	State,
	Acts,
	EstadoHistory<State>
> {
	let history = createHistory( { initial, }, );
	const compare = compareCallback( options?.compare, );
	const afterChange = typeof options?.afterChange === 'function' ? options?.afterChange : noop;
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
			if ( history.state === next.state || history.initial === next.state ) {
				return history;
			}
			const nextHistory = {
				...history,
				...findChanges(
					next.initial,
					next.state,
					compare as CompareCallbackReturn,
				) as unknown as EstadoHistory<State>['changes'],
				state: next.state,
				initial: next.initial,
				priorState: history.state,
			};
			history = nextHistory;
			Promise.resolve().then( () => afterChange( history as Immutable<EstadoHistory<State>>, ), );
			return nextHistory;
		}

		if ( typeof stateHistoryPath === 'undefined' ) {
			return [
				_draft,
				finalize,
			];
		}

		const draft = typeof stateHistoryPath === 'string'
			? getDeepStringPath( _draft, stateHistoryPath, )
			: _draft;

		if ( typeof draft !== 'undefined' ) {
			return [
				draft,
				finalize,
			];
		}

		return [
			undefined,
			undefined,
		];
	}

	function _set( ...args: [targetStatePath?: 'state' | 'initial', unknown?, unknown?,] ) {
		const [
			targetStatePath,
			...props
		] = args;
		if ( !props.length ) {
			return history;
		}

		const mut = getDraft( targetStatePath, );
		const [draft, finalize,] = mut;

		if ( typeof draft === 'undefined' ) {
			return history;
		}

		if ( typeof finalize !== 'function' ) {
			return history;
		}

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
			const arrayPath = ( typeof statePath === 'string' ? splitPath( statePath, ) : statePath ) as string[];
			const penPath = arrayPath.at( -1, );
			if ( typeof penPath !== 'string' ) {
				return history;
			}
			const [
				value,
				parent,
			] = getDeepArrayPath( draft, arrayPath, );

			if ( typeof nextState === 'function' && value && typeof value === 'object' ) {
				nextState(
					createArrayPathProxy( value, history, arrayPath.slice( 1, ), ),
				);
			}
			else if ( parent && typeof parent === 'object' && penPath in parent ) {
				Reflect.set( parent, penPath, nextState, );
			}
		}

		return finalize();
	}

	const createActProps: CreateActsProps<State, EstadoHistory<State>> = {
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
			return getDeepStringPath( history, stateHistoryPath, ) as Immutable<GetStringPathValue<State, typeof stateHistoryPath>>;
		},
		getDraft: getDraft as GetDraftRecord<State>['getDraft'],
		reset() {
			history = {
				initial: history.initial,
				changes: undefined,
				priorInitial: history.priorInitial == null ? history.priorInitial : history.initial,
				priorState: history.priorState == null ? history.priorState : history.state,
				state: history.initial,
			};
			Promise.resolve().then( () => afterChange( history as Immutable<EstadoHistory<State>>, ), );
			return history;
		},
		set( ...args: unknown[] ) {
			return _set( undefined, ...args, );
		},
	};

	const acts = Object.freeze( typeof options?.acts === 'function' ? options.acts( createActProps, ) : {} as Acts, );

	return Object.freeze( {
		...createActProps,
		acts,
	}, );
}
