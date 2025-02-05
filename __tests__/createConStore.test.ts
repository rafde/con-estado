import { renderHook, act, } from '@testing-library/react';
import { afterEach, expect, } from 'vitest';
import { createConStore, } from '../src/index';
import { strictDeepEqual, } from 'fast-equals';
import type { UseEstadoProps, } from 'src/types/UseEstadoProps';
import type { ActRecord, } from 'src/types/ActRecord';

const initialState = {
	count: 0,
	test: 'test',
};
function createSelector( state: typeof initialState, options?: UseEstadoProps<typeof initialState, ActRecord>, ) {
	return createConStore(
		state,
		{
			...options,
			acts: ( { set, }, ) => ( {
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
		},
	);
}

describe( 'createConStore', () => {
	let useConSelector = createSelector( initialState, );
	afterEach( () => {
		useConSelector = createSelector( initialState, );
	}, );

	it( 'should initialize with the correct initial state', () => {
		const { result, } = renderHook( () => useConSelector(), );
		expect( result.current[ 0 ], ).toEqual( initialState, );
	}, );

	it( 'should maintain immutable state', () => {
		const { result, } = renderHook( () => useConSelector(), );

		const [initialSnapshot,] = result.current;

		act( () => {
			result.current[ 1 ].acts.increment();
		}, );

		expect( result.current[ 0 ], ).not.toBe( initialSnapshot, );
		expect( strictDeepEqual( result.current[ 0 ], initialSnapshot, ), ).toBe( false, );
	}, );

	describe( 'acts', () => {
		it( 'should update state correctly when actions are dispatched', () => {
			const { result, } = renderHook( () => useConSelector(), );

			act( () => {
				result.current[ 1 ].acts.increment();
			}, );

			expect( result.current[ 0 ].count, ).toBe( 1, );

			act( () => {
				result.current[ 1 ].acts.decrement();
			}, );

			expect( result.current[ 0 ].count, ).toBe( 0, );
		}, );
	}, );

	describe( 'selector', () => {
		it( 'should return the correct state based on the selector option', () => {
			const useConSelector = createConStore(
				initialState,
				{
					selector: props => ( {
						test: props.state.test,
						setText: ( text: string, ) => props.set( 'state.test', text, ),
					} ),
				},
			);
			const { result, } = renderHook( () => useConSelector(), );

			act( () => {
				result.current.setText( 'new text', );
			}, );

			expect( result.current.test, ).toBe( 'new text', );
		}, );

		it( 'should return the correct state based on the useConSelector selector', () => {
			const { result, } = renderHook( () => useConSelector( props => ( {
				test: props.state.test,
				setText: props.setWrap(
					'state.test', ( _, text: string, ) => text,
				),
			} ), ), );

			act( () => {
				result.current.setText( 'new text', );
			}, );

			expect( result.current.test, ).toBe( 'new text', );
		}, );
	}, );
}, );
