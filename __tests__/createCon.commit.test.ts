import { describe, expect, it, beforeEach, } from 'vitest';
import createCon from '../src/_internal/createCon';

const initial = {
	count: 0,
	nested: {
		value: 10,
	},
	flags: {
		active: true,
	},
	items: [
		{
			id: 1,
			price: 10,
		},
	],
};

describe( 'createCon - commit', () => {
	let con = createCon( initial, );

	beforeEach( () => {
		con = createCon( initial, );
	}, );

	it( 'should provide correct callback properties on first update', () => {
		con.commit( 'count', ( props, ) => {
			expect( props.prevProp, ).toBe( undefined, );
			expect( props.prevInitialProp, ).toBe( undefined, );
			expect( props.changesProp, ).toBe( undefined, );
			expect( props.prev, ).toBe( undefined, );
			expect( props.prevInitial, ).toBe( undefined, );
			expect( props.changes, ).toBe( undefined, );

			props.stateProp = 5;
			props.initialProp = 1;
		}, );

		expect( con.get().state.count, ).toBe( 5, );
		expect( con.get().initial.count, ).toBe( 1, );
		expect( con.get().prev, ).toEqual( initial, );
		expect( con.get().prevInitial, ).toEqual( initial, );
		expect( con.get().changes, ).toEqual( { count: 5, }, );
	}, );

	it( 'should provide correct callback properties on subsequent updates', () => {
		// First update
		con.commit( 'count', ( props, ) => {
			props.stateProp = 5;
			props.initialProp = 1;
		}, );

		expect( con.get().state.count, ).toBe( 5, );
		expect( con.get().initial.count, ).toBe( 1, );
		expect( con.get().prev, ).toEqual( initial, );
		expect( con.get().prevInitial, ).toEqual( initial, );
		expect( con.get().changes, ).toEqual( { count: 5, }, );

		const history = con.get();

		// Second update
		con.commit( 'count', ( props, ) => {
			expect( props.prevProp, ).toBe( 0, );
			expect( props.prevInitialProp, ).toBe( 0, );
			expect( props.changesProp, ).toBe( 5, );
			expect( props.prev, ).toEqual( initial, );
			expect( props.prevInitial, ).toEqual( initial, );
			expect( props.changes, ).toEqual( { count: 5, }, );

			props.stateProp = 10;
			props.initialProp = 2;
		}, );

		expect( con.get().state.count, ).toBe( 10, );
		expect( con.get().initial.count, ).toBe( 2, );
		expect( con.get().prev, ).toEqual( history.state, );
		expect( con.get().prevInitial, ).toEqual( history.initial, );
		expect( con.get().changes, ).toEqual( { count: 10, }, );
	}, );

	it( 'should provide correct callback properties for nested paths', () => {
		// First update
		con.commit( 'nested.value', ( props, ) => {
			props.stateProp = 20;
			props.initialProp = 15;
		}, );

		// Second update
		con.commit( 'nested.value', ( props, ) => {
			expect( props.prevProp, ).toBe( 10, );
			expect( props.prevInitialProp, ).toBe( 10, );
			expect( props.changesProp, ).toBe( 20, );
			expect( props.prev, ).toEqual( initial, );
			expect( props.prevInitial, ).toEqual( initial, );
			expect( props.changes, ).toEqual( { nested: { value: 20, }, }, );

			props.stateProp = 30;
			props.initialProp = 25;
		}, );
	}, );

	it( 'should provide correct callback properties for array paths', () => {
		// First update
		con.commit( ['items', 0, 'price',], ( props, ) => {
			props.stateProp = 20;
			props.initialProp = 15;
		}, );

		// Second update
		con.commit( ['items', 0, 'price',], ( props, ) => {
			expect( props.prevProp, ).toBe( 10, );
			expect( props.prevInitialProp, ).toBe( 10, );
			expect( props.changesProp, ).toBe( 20, );
			expect( props.prev, ).toEqual( initial, );
			expect( props.prevInitial, ).toEqual( initial, );
			expect( props.changes, ).toEqual( { items: [{ price: 20, },], }, );

			props.stateProp = 30;
			props.initialProp = 25;
		}, );
	}, );

	it( 'should provide correct callback properties for root updates', () => {
		// First update
		con.commit( ( { state, initial, }, ) => {
			state.count = 5;
			initial.count = 1;
		}, );

		// Second update
		con.commit( ( props, ) => {
			expect( props.prev, ).toEqual( initial, );
			expect( props.prevInitial, ).toEqual( initial, );
			expect( props.changes, ).toEqual( { count: 5, }, );

			props.state.count = 10;
			props.initial.count = 2;
		}, );
	}, );

	it( 'should handle multiple nested property updates with correct history', () => {
		// First update
		con.commit( ( { state, initial, }, ) => {
			state.count = 5;
			state.nested.value = 20;
			initial.count = 1;
			initial.nested.value = 15;
		}, );

		// Second update
		con.commit( ( props, ) => {
			expect( props.prev, ).toEqual( initial, );
			expect( props.prevInitial, ).toEqual( initial, );
			expect( props.changes, ).toEqual( {
				count: 5,
				nested: { value: 20, },
			}, );

			props.state.count = 10;
			props.state.nested.value = 30;
		}, );
	}, );

	// Original tests...
	it( 'should commit using callback function', () => {
		con.commit( ( { state, initial, }, ) => {
			state.count = 5;
			initial.count = 1;
		}, );

		expect( con.get().state.count, ).toBe( 5, );
		expect( con.get().initial.count, ).toBe( 1, );
	}, );

	it( 'should commit nested path updates', () => {
		con.commit( 'nested.value', ( props, ) => {
			props.stateProp = 20;
			props.initialProp = 15;
		}, );

		expect( con.get().state.nested.value, ).toBe( 20, );
		expect( con.get().initial.nested.value, ).toBe( 15, );
	}, );

	it( 'should throw error if no callback provided', () => {
		expect( () => {
			// @ts-expect-error -- testing throw
			con.commit();
		}, ).toThrowError( /needs a callback function/, );
	}, );

	it( 'should throw error if callback is not a function', () => {
		expect( () => {
			// @ts-expect-error -- testing throw
			con.commit( { count: 5, }, );
		}, ).toThrowError( /needs a callback function/, );
	}, );

	it( 'should maintain previous state references', () => {
		const beforeState = con.get().state;

		con.commit( ( { state, }, ) => {
			state.count = 5;
		}, );

		const history = con.get();
		expect( history.prev, ).toBe( beforeState, );
		expect( history.prevInitial, ).toBe( undefined, );
		expect( history.changes, ).toEqual( { count: 5, }, );
	}, );
}, );
