import { waitFor, } from '@testing-library/react';
import { afterEach, describe, expect, it, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - wrap', () => {
	const initial = {
		count: 0,
		nested: {
			value: 10,
			items: ['a', 'b', 'c',],
		},
		flags: {
			active: true,
		},
	};

	let con = createCon( initial, );
	afterEach( () => {
		con = createCon( initial, );
	}, );

	it( 'should return non-proxy', () => {
		const wrapped = con.wrap( 'count', ( props, ) => {
			expect( props.prevProp, ).toBe( undefined, );
			expect( props.prevInitialProp, ).toBe( undefined, );
			expect( props.changesProp, ).toBe( undefined, );
			expect( props.prev, ).toBe( undefined, );
			expect( props.prevInitial, ).toBe( undefined, );
			expect( props.changes, ).toEqual( undefined, );
			props.stateProp++;
			return props.state.nested;
		}, );
		const nested = wrapped();
		expect( con.get().state.count, ).toBe( 1, );
		expect( con.get().state.nested, ).toEqual( nested, );
	}, );

	it( 'takes function as first argument', () => {
		const wrapped = con.wrap( ( props, increment: number, ) => props.state.count += increment, );
		wrapped( 5, );
		expect( con.get().state.count, ).toBe( 5, );
	}, );

	it( 'wraps state updates with multiple arguments', () => {
		let wrapped = con.wrap( 'count', ( props, increment: number, ) => {
			expect( props.prevProp, ).toBe( undefined, );
			expect( props.prevInitialProp, ).toBe( undefined, );
			expect( props.changesProp, ).toBe( undefined, );
			expect( props.prev, ).toBe( undefined, );
			expect( props.prevInitial, ).toBe( undefined, );
			expect( props.changes, ).toEqual( undefined, );

			props.stateProp += increment;
			props.initialProp += increment + increment;
		}, );
		wrapped( 5, );
		expect( con.get().state.count, ).toBe( 5, );
		expect( con.get().initial.count, ).toBe( 10, );
		expect( con.get().prev, ).toEqual( initial, );
		expect( con.get().prevInitial, ).toEqual( initial, );
		expect( con.get().changes, ).toEqual( { count: 5, }, );

		wrapped = con.wrap( 'count', ( props, increment: number, ) => {
			expect( props.prevProp, ).toBe( 0, );
			expect( props.prevInitialProp, ).toBe( 0, );
			expect( props.changesProp, ).toBe( 5, );
			expect( props.prev, ).toEqual( initial, );
			expect( props.prevInitial, ).toEqual( initial, );
			expect( props.changes, ).toEqual( { count: 5, }, );
			props.stateProp += increment;
			props.initialProp += increment;
		}, );
		wrapped( 5, );
		expect( con.get().state.count, ).toBe( 10, );
		expect( con.get().initial.count, ).toBe( 15, );
	}, );

	it( 'handles nested path updates', () => {
		const wrapped = con.wrap( 'nested.value', ( props, multiplier: number, ) => props.stateProp *= multiplier, );
		wrapped( 2, );
		expect( con.get().state.nested.value, ).toBe( 20, );
	}, );

	it( 'supports array path with nested updates', () => {
		const wrapped = con.wrap( ['nested', 'value',], props => props.stateProp *= 3, );
		wrapped();
		expect( con.get().state.nested.value, ).toBe( 30, );
	}, );

	it( 'handles function-based updates with context', () => {
		const wrapped = con.wrap( ( { state, }, multiplier: number, ) => {
			state.nested.value *= multiplier;
		}, );
		wrapped( 4, );
		expect( con.get().state.nested.value, ).toBe( 40, );
	}, );

	it( 'mutate array elements in nested structures', () => {
		const wrapped = con.wrap(
			'nested.items',
			( props, prefix: string, ) => props.stateProp.forEach( ( item, i, a, ) => {
				a[ i ] = prefix + item;
			}, ),
		);
		wrapped( 'test_', );
		expect( con.get().state.nested.items, ).toEqual( ['test_a', 'test_b', 'test_c',], );
	}, );

	it( 'update array in nested structures', () => {
		const wrapped = con.wrap(
			'nested.items',
			( props, prefix: string, ) => props.stateProp = props.stateProp.map( item => prefix + item, ),
		);
		wrapped( 'test_', );
		expect( con.get().state.nested.items, ).toEqual( ['test_a', 'test_b', 'test_c',], );
	}, );

	it( 'handles boolean toggles with wrapped functions', () => {
		const wrapped = con.wrap( 'flags.active', props => props.stateProp = !props.stateProp, );
		wrapped();
		expect( con.get().state.flags.active, ).toBe( false, );
	}, );

	it( 'chains multiple wrapped updates', () => {
		const wrapCount = con.wrap( 'count', ( props, inc: number, ) => props.stateProp += inc, );
		const wrapValue = con.wrap( 'nested.value', ( props, mult: number, ) => props.stateProp *= mult, );

		wrapCount( 2, );
		wrapValue( 2, );

		const state = con.get().state;
		expect( state.count, ).toBe( 2, );
		expect( state.nested.value, ).toBe( 20, );
	}, );

	it( 'should should throw an error if no functions are sent', () => {
		expect(
			// @ts-expect-error -- testing throw
			() => con.wrap(),
		).toThrowError( /callback function to wrap/, );
	}, );

	it( 'should should throw an error if first param is valid but second param is not a function', () => {
		expect(
			// @ts-expect-error -- testing throw
			() => con.wrap( 'count', ),
		).toThrowError( /callback function to wrap/, );
	}, );

	it( 'takes function that returns a promise', async() => {
		const wrapped = con.wrap( ( props, increment: number, ) => Promise.resolve( props.state.count += increment, ), );
		return waitFor( async() => {
			await wrapped( 5, );
			expect( con.get().state.count, ).toBe( 5, );
		}, );
	}, );

	it( 'takes async function ', async() => {
		const wrapped = con.wrap( async( props, increment: number, ) => await Promise.resolve().then( () => props.state.count += increment, ), );
		return waitFor( async() => {
			await wrapped( 5, );
			expect( con.get().state.count, ).toBe( 5, );
		}, );
	}, );
}, );
