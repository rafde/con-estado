import type { ActRecord, } from '../types/ActRecord';
import type { ConOptions, } from '../types/ConOptions';
import type { CreateActsProps, } from '../types/CreateActsProps';
import type { CreateConReturnType, } from '../types/CreateConReturnType';
import type { DS, } from '../types/DS';
import type { GetArrayPathValue, } from '../types/GetArrayPathValue';
import type { History, } from '../types/History';
import type { Immutable, } from '../types/Immutable';
import type { NestedRecordKeys, } from '../types/NestedRecordKeys';
import type { Ops, } from '../types/Ops';
import type { StringPathToArray, } from '../types/StringPathToArray';
import createHistoryProxy from './createHistoryProxy';
import deepAccess from './deepAccess';
import getHistoryDraft from './getHistoryDraft';
import { isNil, isObj, } from './is';
import objectIs from './objectIs';
import noop from './noop';
import parseSegments from './parseSegments';
import reset from './reset';
import handleStateOperation from './stateOperations';

const EMPTY_OBJECT = Object.freeze( {}, );
let counter = 0;

const fo = <
	AR extends ActRecord,
>() => EMPTY_OBJECT as AR;

/**
 * Internal configuration options for creating a state container
 *
 * @template S - The data structure type extending DS
 * @template AR - Action Record type defining custom action handlers
 *
 * @extends ConOptions<S, AR> - Base configuration options
 *
 * @property dispatcher - Optional function called when history changes
 *   Used to notify subscribers of state changes
 */
type CreateConOptions<
	S extends DS,
	AR extends ActRecord,
> = ConOptions<S, AR> & {
	dispatcher?: ( history: Immutable<History<S>> ) => void
};

/**
 * Creates a state container with history tracking and state manipulation capabilities
 *
 * @template S - The data structure type extending DS (must be a plain object or array)
 * @template AR - Action Record type defining custom action handlers
 *
 * @param {S} initial - Initial state value
 * @param {CreateConOptions<S, AR>} [options={}] - Configuration options
 *
 * @returns {CreateConReturnType<S, AR>} Object containing state manipulation methods and custom actions
 *
 * @throws {Error} When initial state is not a plain object or array
 *
 * @internal
 * This is an internal function used by createConStore and should not be used directly.
 * It provides the core state management functionality without the React integration.
 */
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

	let mutable: ReturnType<typeof getHistoryDraft> | null;
	let currentOpId: `${Ops}${number}` | null;

	function _dispatch( nextHistory: History<S>, ) {
		mutable = null;
		currentOpId = null;
		if ( objectIs( history, nextHistory, ) ) {
			return history;
		}
		history = nextHistory;
		dispatcher( history as Immutable<History<S>>, );
		queueMicrotask( () => afterChange( history as Immutable<History<S>>, ), );
		return nextHistory;
	}

	const getDraft = ( opId: `${Ops}${number}`, ) => {
		if ( currentOpId && mutable ) {
			return mutable;
		}
		currentOpId = opId;
		mutable = getHistoryDraft(
			history,
			_dispatch,
			beforeChange,
			opId,
			mutOptions,
		);
		return mutable;
	};

	function get<S extends DS, SHP extends NestedRecordKeys<History<S>>,>(
		stateHistoryPath?: SHP,
	): Immutable<History<S>> | Immutable<GetArrayPathValue<S, StringPathToArray<SHP>>> {
		if ( isNil( stateHistoryPath, ) ) {
			// No argument version
			return history as Immutable<History<S>>;
		}
		const path = typeof stateHistoryPath === 'string' ? parseSegments( stateHistoryPath, ) : stateHistoryPath;
		return deepAccess(
			history,
			path,
		) as Immutable<GetArrayPathValue<S, StringPathToArray<typeof stateHistoryPath>>>;
	}

	const props: CreateActsProps<S> = {
		commit( ...args: unknown[] ) {
			handleStateOperation( 'commit', getDraft, history, args, counter++, );
		},
		get: get as CreateActsProps<S>['get'],
		// getDraft: getDraft as GetDraftRecord<S>['getDraft'],
		merge( ...args: unknown[] ) {
			handleStateOperation( 'merge', getDraft, history, args, counter++, );
		},
		reset() {
			if ( currentOpId ) {
				throw new Error( 'Cannot `reset` while an operation is in progress', );
			}
			currentOpId = `reset${++counter}`;
			_dispatch( reset( history, beforeChange, ), );
		},
		set( ...args: unknown[] ) {
			handleStateOperation( 'set', getDraft, history, args, counter++, );
		},
		wrap( ...args: unknown[] ) {
			return handleStateOperation( 'wrap', getDraft, history, args, counter++, ) as ReturnType<CreateActsProps<S>['wrap']>;
		},
	};

	return Object.freeze( {
		...props,
		acts: acts( props, ),
	}, );
}
