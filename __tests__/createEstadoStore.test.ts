import { renderHook, act, } from '@testing-library/react';
import { afterEach, expect, } from 'vitest';
import { createEstadoStore, } from '../src/index';
import { strictDeepEqual, } from 'fast-equals';

const initialState = { count: 0, };
function createSelector( state: typeof initialState, ) {
	return createEstadoStore(
		state,
		( { set, }, ) => ( {
			increment() {
				set( 'state', ( { draft, }, ) => {
					draft.count++;
				}, );
			},
			incrementBy( num: number, ) {
				set( 'state', ( { draft, }, ) => {
					draft.count += num;
				}, );
			},
			decrement() {
				set( 'state', ( { draft, }, ) => {
					draft.count--;
				}, );
			},
		} ),
	);
}

describe( 'createEstadoStore', () => {
	let useEstadoSelector = createSelector( initialState, );
	afterEach( () => {
		useEstadoSelector = createSelector( initialState, );
	}, );

	it( 'should initialize with the correct initial state', () => {
		const { result, } = renderHook( () => useEstadoSelector(), );
		expect( result.current[ 0 ], ).toEqual( initialState, );
	}, );

	it( 'should update state correctly when actions are dispatched', () => {
		const { result, } = renderHook( () => useEstadoSelector(), );

		act( () => {
			result.current[ 1 ].acts.increment();
		}, );

		expect( result.current[ 0 ].count, ).toBe( 1, );

		act( () => {
			result.current[ 1 ].acts.decrement();
		}, );

		expect( result.current[ 0 ].count, ).toBe( 0, );
	}, );

	it( 'should return the correct state based on the selector function', () => {
		const { result, } = renderHook( () => useEstadoSelector( props => props.state.count, ), );

		act( () => {
			useEstadoSelector.acts.incrementBy( 10, );
		}, );

		expect( result.current, ).toBe( 10, );
	}, );

	it( 'should maintain immutable state', () => {
		const { result, } = renderHook( () => useEstadoSelector(), );

		const [initialSnapshot,] = result.current;

		act( () => {
			result.current[ 1 ].acts.increment();
		}, );

		expect( result.current[ 0 ], ).not.toBe( initialSnapshot, );
		expect( strictDeepEqual( result.current[ 0 ], initialSnapshot, ), ).toBe( false, );
	}, );
}, );
