import { afterEach, describe, expect, it, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - setWrap', () => {
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

	it( 'takes function as first argument', () => {
		const wrapped = con.setWrap( ( props, increment: number, ) => props.draft.count += increment, );
		wrapped( 5, );
		expect( con.get().state.count, ).toBe( 5, );
	}, );

	it( 'wraps state updates with multiple arguments', () => {
		const wrapped = con.setWrap( 'count', ( props, increment: number, ) => props.draft += increment, );
		wrapped( 5, );
		expect( con.get().state.count, ).toBe( 5, );
	}, );

	it( 'handles nested path updates', () => {
		const wrapped = con.setWrap( 'nested.value', ( props, multiplier: number, ) => props.draft *= multiplier, );
		wrapped( 2, );
		expect( con.get().state.nested.value, ).toBe( 20, );
	}, );

	it( 'supports array path with nested updates', () => {
		const wrapped = con.setWrap( ['nested', 'value',], props => props.draft *= 3, );
		wrapped();
		expect( con.get().state.nested.value, ).toBe( 30, );
	}, );

	it( 'handles function-based updates with context', () => {
		const wrapped = con.setWrap( ( { draft, }, multiplier: number, ) => {
			draft.nested.value *= multiplier;
		}, );
		wrapped( 4, );
		expect( con.get().state.nested.value, ).toBe( 40, );
	}, );

	it( 'mutate array elements in nested structures', () => {
		const wrapped = con.setWrap(
			'nested.items',
			( props, prefix: string, ) => props.draft.forEach( ( item, i, a, ) => {
				a[ i ] = prefix + item;
			}, ),
		);
		wrapped( 'test_', );
		expect( con.get().state.nested.items, ).toEqual( ['test_a', 'test_b', 'test_c',], );
	}, );

	it( 'update array in nested structures', () => {
		const wrapped = con.setWrap(
			'nested.items',
			( props, prefix: string, ) => props.draft = props.stateProp.map( item => prefix + item, ),
		);
		wrapped( 'test_', );
		expect( con.get().state.nested.items, ).toEqual( ['test_a', 'test_b', 'test_c',], );
	}, );

	it( 'handles boolean toggles with wrapped functions', () => {
		const wrapped = con.setWrap( 'flags.active', props => props.draft = !props.stateProp, );
		wrapped();
		expect( con.get().state.flags.active, ).toBe( false, );
	}, );

	it( 'chains multiple wrapped updates', () => {
		const wrapCount = con.setWrap( 'count', ( props, inc: number, ) => props.draft += inc, );
		const wrapValue = con.setWrap( 'nested.value', ( props, mult: number, ) => props.draft *= mult, );

		wrapCount( 2, );
		wrapValue( 2, );

		const state = con.get().state;
		expect( state.count, ).toBe( 2, );
		expect( state.nested.value, ).toBe( 20, );
	}, );

	it( 'should should throw an error if no functions are sent', () => {
		expect(
			// @ts-expect-error -- testing throw
			() => con.setWrap(),
		).toThrowError( /callback function to wrap/, );
	}, );

	it( 'should should throw an error if first param is valid but second param is not a function', () => {
		expect(
			// @ts-expect-error -- testing throw
			() => con.setWrap( 'count', ),
		).toThrowError( /callback function to wrap/, );
	}, );
}, );
