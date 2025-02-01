import { afterEach, describe, expect, it, } from 'vitest';
import { createConBase, } from '../src/';
import type { OptionCompare, } from '../src/types/OptionCompare';

describe( 'createConBase - options.compare', () => {
	class CompareTest {
		value: unknown;
		constructor( value: unknown, ) {
			this.value = value;
		}

		getValue() {
			return this.value;
		}
	}
	const initialState = {
		counter: 0,
		list: ['item1',],
		test1: new CompareTest( 'test', ),
	};
	const customCompare: OptionCompare<typeof initialState> = ( prev: unknown, next: unknown, { key, cmp, }, ) => {
		let p = prev;
		let n = next;

		if ( key === 'test1' ) {
			if ( prev instanceof CompareTest ) {
				p = prev.getValue();
			}
			if ( n instanceof CompareTest ) {
				n = n.getValue();
			}
		}

		return cmp( p, n, );
	};
	let estado = createConBase( initialState, { compare: customCompare, }, );
	let history = estado.get();
	afterEach( () => {
		estado = createConBase( initialState, { compare: customCompare, }, );
		history = estado.get();
	}, );

	it( 'should use custom compare function to detect changes', () => {
		const test1 = new CompareTest( 'update', );
		// Modify the state
		const nextHistory = estado.set( ( { draft, }, ) => {
			draft.state.test1 = test1; // Change the counter value
		}, );

		// Since the custom compare function only checks the number of keys,
		// the state should be considered unchanged
		expect( nextHistory.changes, ).toStrictEqual( { test1, }, );
		expect( nextHistory.state, ).toStrictEqual( {
			counter: 0,
			list: ['item1',],
			test1,
		}, );
		expect( nextHistory.priorState, ).toStrictEqual( history.state, );
		expect( nextHistory.initial, ).toBe( history.initial, );
		expect( nextHistory.priorInitial, ).toBe( history.priorInitial, );
	}, );

	it( 'should detect changes when custom compare function returns false for state', () => {
		// Modify the state
		const test1 = new CompareTest( 'test', );
		const nextHistory = estado.set( ( { draft, }, ) => {
			draft.state.test1 = test1; // Change the counter value
		}, );

		expect( nextHistory, ).toBe( history, );
		expect( nextHistory.changes, ).toBe( undefined, );
		expect( nextHistory.state, ).toBe( history.state, );
		expect( nextHistory.priorState, ).toBe( undefined, );
		expect( nextHistory.initial, ).toBe( history.initial, );
		expect( nextHistory.priorInitial, ).toBe( history.priorInitial, );
	}, );

	it( 'should detect changes when custom compare function returns false for initial', () => {
		// Modify the state
		const test1 = new CompareTest( 'test', );
		const nextHistory = estado.set( ( { draft, }, ) => {
			draft.initial.test1 = test1; // Change the counter value
		}, );

		expect( nextHistory, ).toBe( history, );
		expect( nextHistory.changes, ).toBe( undefined, );
		expect( nextHistory.state, ).toBe( history.state, );
		expect( nextHistory.priorState, ).toBe( undefined, );
		expect( nextHistory.initial, ).toBe( history.initial, );
		expect( nextHistory.priorInitial, ).toBe( history.priorInitial, );
	}, );

	it( 'should detect changes when custom compare function returns false for initial and state', () => {
		// Modify the state
		const test1 = new CompareTest( 'test', );
		const nextHistory = estado.set( ( { draft, }, ) => {
			draft.state.test1 = test1; // Change the counter value
			draft.initial.test1 = test1; // Change the counter value
		}, );

		expect( nextHistory, ).toBe( history, );
		expect( nextHistory.changes, ).toBe( undefined, );
		expect( nextHistory.state, ).toBe( history.state, );
		expect( nextHistory.priorState, ).toBe( undefined, );
		expect( nextHistory.initial, ).toBe( history.initial, );
		expect( nextHistory.priorInitial, ).toBe( history.priorInitial, );
	}, );

	it( 'should handle deep comparison with custom compare function', () => {
		const compare = ( a: unknown, b: unknown, ) => {
			// Deep comparison for objects
			if ( typeof a === 'object' && typeof b === 'object' && a !== null && b !== null ) {
				return JSON.stringify( a, ) === JSON.stringify( b, );
			}
			return a === b;
		};

		const estado = createConBase( initialState, { compare, }, );
		const history = estado.get();

		// Modify the state
		estado.set( ( { draft, }, ) => {
			draft.state.counter = 1; // Change the counter value
		}, );

		const nextHistory = estado.get();

		// Since the custom compare function performs deep comparison,
		// the state should be considered changed
		expect( nextHistory.changes, ).toStrictEqual( { counter: 1, }, );
		expect( nextHistory.state, ).toStrictEqual( {
			...initialState,
			counter: 1,
		}, );
		expect( nextHistory.priorState, ).toStrictEqual( history.state, );
		expect( nextHistory.initial, ).toBe( history.initial, );
		expect( nextHistory.priorInitial, ).toBe( history.priorInitial, );
	}, );

	it( 'should handle arrays with custom compare function', () => {
		const compare = ( a: unknown, b: unknown, ) => {
			// Treat arrays as equal if they have the same length
			if ( Array.isArray( a, ) && Array.isArray( b, ) ) {
				return a.length === b.length;
			}
			return a === b;
		};

		const estado = createConBase( initialState, { compare, }, );
		const history = estado.get();

		// Modify the state
		estado.set( ( { draft, }, ) => {
			draft.state.list.push( 'item2', ); // Add an item to the list
		}, );

		const nextHistory = estado.get();

		expect( nextHistory.state, ).toStrictEqual( {
			...initialState,
			list: ['item1', 'item2',],
		}, );
		expect( nextHistory.priorState, ).toStrictEqual( history.state, );
		// Since the custom compare function only checks the length of arrays,
		// the state should be considered unchanged
		expect( nextHistory.changes, ).toStrictEqual( {
			list: ['item1', 'item2',],
		}, );
		expect( nextHistory.initial, ).toBe( history.initial, );
		expect( nextHistory.priorInitial, ).toBe( history.priorInitial, );
	}, );
}, );
