import { describe, expect, test, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createConBase - setHistoryWrap', () => {
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

	test( 'wraps state updates with multiple arguments', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap( 'state.count', ( props, increment: number, ) => props.draft += increment, );
		wrapped( 5, );
		expect( con.get().state.count, ).toBe( 5, );
	}, );

	test( 'handles nested path updates', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap( 'state.nested.value', ( props, multiplier: number, ) => props.draft *= multiplier, );
		wrapped( 2, );
		expect( con.get().state.nested.value, ).toBe( 20, );
	}, );

	test( 'supports array path with nested updates', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap( ['state', 'nested', 'value',], props => props.draft *= 3, );
		wrapped();
		expect( con.get().state.nested.value, ).toBe( 30, );
	}, );

	test( 'handles function-based updates with context', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap( ( { draft, }, multiplier: number, ) => {
			draft.state.nested.value *= multiplier;
		}, );
		wrapped( 4, );
		expect( con.get().state.nested.value, ).toBe( 40, );
	}, );

	test( 'mutate array elements in nested structures', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap(
			'state.nested.items',
			( props, prefix: string, ) => props.draft.forEach( ( item, i, a, ) => {
				a[ i ] = prefix + item;
			}, ),
		);
		wrapped( 'test_', );
		expect( con.get().state.nested.items, ).toEqual( ['test_a', 'test_b', 'test_c',], );
	}, );

	test( 'update array in nested structures', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap(
			'state.nested.items',
			( props, prefix: string, ) => props.draft = props.stateProp.map( item => prefix + item, ),
		);
		wrapped( 'test_', );
		expect( con.get().state.nested.items, ).toEqual( ['test_a', 'test_b', 'test_c',], );
	}, );

	test( 'handles boolean toggles with wrapped functions', () => {
		const con = createCon( initial, );
		const wrapped = con.setHistoryWrap( 'state.flags.active', props => props.draft = !props.stateProp, );
		wrapped();
		expect( con.get().state.flags.active, ).toBe( false, );
	}, );

	test( 'chains multiple wrapped updates', () => {
		const con = createCon( initial, );
		const wrapCount = con.setHistoryWrap( 'state.count', ( props, inc: number, ) => props.draft += inc, );
		const wrapValue = con.setHistoryWrap( 'state.nested.value', ( props, mult: number, ) => props.draft *= mult, );

		wrapCount( 2, );
		wrapValue( 2, );

		const state = con.get().state;
		expect( state.count, ).toBe( 2, );
		expect( state.nested.value, ).toBe( 20, );
	}, );
}, );
