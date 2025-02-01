import { afterEach, describe, expect, it, } from 'vitest';
import { createEstado, } from '../src/';
import type { OptionCompare, } from '../src/types/OptionCompare';

describe( 'options.compare', () => {
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
	let estado = createEstado( initialState, { compare: customCompare, }, );
	let history = estado.get();
	afterEach( () => {
		estado = createEstado( initialState, { compare: customCompare, }, );
		history = estado.get();
	}, );

	it( 'should use custom compare function to detect changes', () => {
		const test1 = new CompareTest( 'update', );
		// Modify the state
		estado.set( ( { draft, }, ) => {
			draft.state.test1 = test1; // Change the counter value
		}, );

		const nextHistory = estado.get();

		// Since the custom compare function only checks the number of keys,
		// the state should be considered unchanged
		expect( nextHistory.changes, ).toStrictEqual( { test1, }, );
		expect( nextHistory.state, ).toStrictEqual( {
			counter: 0,
			list: ['item1',],
			test1,
		}, );
		expect( nextHistory.priorState, ).toStrictEqual( history.state, );
	}, );

	it( 'should detect changes when custom compare function returns false', () => {
		// Modify the state
		const test1 = new CompareTest( 'test', );
		estado.set( ( { draft, }, ) => {
			draft.state.test1 = test1; // Change the counter value
		}, );

		const nextHistory = estado.get();

		expect( nextHistory.changes, ).toBe( undefined, );
		expect( nextHistory.state, ).toBe( history.initial, );
		expect( nextHistory.priorState, ).toBe( undefined, );
	}, );

	it( 'should handle deep comparison with custom compare function', () => {
		const customCompare = ( a: unknown, b: unknown, ) => {
			// Deep comparison for objects
			if ( typeof a === 'object' && typeof b === 'object' && a !== null && b !== null ) {
				return JSON.stringify( a, ) === JSON.stringify( b, );
			}
			return a === b;
		};

		const estado = createEstado( initialState, { compare: customCompare, }, );
		const history = estado.get();

		// Modify the state
		estado.set( ( { draft, }, ) => {
			draft.state.counter = 1; // Change the counter value
		}, );

		const nextHistory = estado.get();

		// Since the custom compare function performs deep comparison,
		// the state should be considered changed
		expect( nextHistory.changes, ).toStrictEqual( { counter: 1, }, );
		expect( nextHistory.state, ).toStrictEqual( { counter: 1,
			list: ['item1',], }, );
		expect( nextHistory.priorState, ).toStrictEqual( history.state, );
	}, );

	it( 'should handle arrays with custom compare function', () => {
		const customCompare = ( a: unknown, b: unknown, ) => {
			// Treat arrays as equal if they have the same length
			if ( Array.isArray( a, ) && Array.isArray( b, ) ) {
				return a.length === b.length;
			}
			return a === b;
		};

		const estado = createEstado( initialState, { compare: customCompare, }, );
		const history = estado.get();

		// Modify the state
		estado.set( ( { draft, }, ) => {
			draft.state.list.push( 'item2', ); // Add an item to the list
		}, );

		const nextHistory = estado.get();

		// Since the custom compare function only checks the length of arrays,
		// the state should be considered unchanged
		expect( nextHistory.changes, ).toBeUndefined();
		expect( nextHistory.state, ).toStrictEqual( { counter: 0,
			list: ['item1', 'item2',], }, );
		expect( nextHistory.priorState, ).toStrictEqual( history.state, );
	}, );
}, );
