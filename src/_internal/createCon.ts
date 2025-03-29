import type { ActRecord, } from '../types/ActRecord';
import type { ConOptions, } from '../types/ConOptions';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { CreateConReturnType, } from '../types/CreateConReturnType';
import type { DS, } from '../types/DS';
import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import type { History, } from '../types/History';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { StringPathToArray, } from '../types/StringPathToArray';
import createHistoryProxy from './createHistoryProxy';
import getDeepValueParentByArray from './getDeepValueParentByArray';
import getHistoryDraft from './getHistoryDraft';
import handleCommit from './handleCommit';
import handleStateUpdate from './handleStateUpdate';
import handleWrap from './handleWrap';
import isNil from './isNil';
import isObj from './isObj';
import isPlainObj from './isPlainObj';
import merge from './mergeHistory';
import noop from './noop';
import parseSegments from './parseSegments';
import reset from './reset';

const EMPTY_OBJECT = Object.freeze( {}, );

const fo = <
	AR extends ActRecord,
>() => EMPTY_OBJECT as AR;

type CreateConOptions<
	S extends DS,
	AR extends ActRecord,
> = ConOptions<S, AR> & {
	dispatcher?: ( history: Immutable<History<S>> ) => void
};

export default function createCon<
	S extends DS,
	AR extends ActRecord,
>(
	initial: S,
	options: CreateConOptions<S, AR> = EMPTY_OBJECT as CreateConOptions<S, AR>,
): CreateConReturnType<S, AR> {
	if ( !isObj( initial, ) ) {
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
		beforeChange = noop,
		mutOptions,
	} = options;

	function _dispatch( nextHistory: History<S>, ) {
		if ( Object.is( history, nextHistory, ) ) {
			return history;
		}
		history = nextHistory;
		dispatcher( history as Immutable<History<S>>, );
		queueMicrotask( () => afterChange( history as Immutable<History<S>>, ), );
		return nextHistory;
	}

	const getDraft = ( stateHistoryPath = mutOptions, options = mutOptions, ) => {
		const statePath = isPlainObj( stateHistoryPath, ) ? undefined : stateHistoryPath;
		const _mutOptions = isPlainObj( stateHistoryPath, ) ? stateHistoryPath : options;
		return getHistoryDraft(
			history,
			_dispatch,
			beforeChange,
			statePath,
			_mutOptions,
		);
	};

	function get<S extends DS, SHP extends NestedRecordKeys<History<S>>,>(
		stateHistoryPath?: SHP,
	): Immutable<History<S>> | Immutable<GetArrayPathValue<S, StringPathToArray<SHP>>> {
		if ( isNil( stateHistoryPath, ) ) {
			// No argument version
			return history as Immutable<History<S>>;
		}
		return getDeepValueParentByArray(
			history,
			parseSegments( stateHistoryPath, ),
		)[ 0 ] as Immutable<GetArrayPathValue<S, StringPathToArray<typeof stateHistoryPath>>>;
	}

	const props: CreateActsProps<S> = {
		commit( ...args: unknown[] ) {
			return handleCommit( getDraft, history, ...args, );
		},
		get: get as CreateActsProps<S>['get'],
		// getDraft: getDraft as GetDraftRecord<S>['getDraft'],
		merge( ...args: unknown[] ) {
			return merge( args, history, getDraft, );
		},
		reset() {
			return _dispatch( reset( history, beforeChange, ), );
		},
		set( ...args: unknown[] ) {
			if ( args.length === 0 ) {
				return history;
			}

			return handleStateUpdate( getDraft, args, );
		},
		wrap( ...args: unknown[] ) {
			return handleWrap( getDraft, history, ...args, );
		},
	};

	return Object.freeze( {
		...props,
		acts: acts( props, ),
	}, );
}
