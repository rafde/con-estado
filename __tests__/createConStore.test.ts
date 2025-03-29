import { renderHook, act, } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, } from 'vitest';
import { createConStore, } from '../src/';
import { strictDeepEqual, } from 'fast-equals';

const initialState = {
	count: 0,
	test: 'test',
};

describe( 'createConStore', () => {
	let useConSelector = createConStore( initialState, );
	beforeEach( () => {
		useConSelector = createConStore( initialState, );
	}, );

	it( 'should initialize with the correct initial state', () => {
		const { result, } = renderHook( () => useConSelector(), );
		expect( result.current[ 0 ], ).toEqual( initialState, );
	}, );

	it( 'should initialize with the correct initial state', () => {
		const { result: uCS, } = renderHook( () => createConStore( () => initialState, ), );
		const { result, } = renderHook( () => uCS.current(), );
		expect( result.current[ 0 ], ).toEqual( initialState, );
	}, );

	it( 'should maintain immutable state', () => {
		const { result, } = renderHook( () => useConSelector(), );

		const [initialSnapshot, controls,] = result.current;

		act( () => {
			controls.commit( ( { state, }, ) => {
				state.count++;
			}, );
		}, );

		expect( result.current[ 0 ], ).not.toBe( initialSnapshot, );
		expect( strictDeepEqual( result.current[ 0 ], initialSnapshot, ), ).toBe( false, );
	}, );

	it( 'should not change', () => {
		const { result, } = renderHook( () => useConSelector(), );

		const [initialSnapshot, controls,] = result.current;

		act( () => {
			controls.commit( ( { state, }, ) => {
				state.count = 0;
			}, );
		}, );

		expect( result.current[ 0 ], ).toBe( initialSnapshot, );
		expect( strictDeepEqual( result.current[ 0 ], initialSnapshot, ), ).toBe( true, );
	}, );

	describe( 'acts', () => {
		function createSelector() {
			return createConStore(
				initialState,
				{
					acts: ( { commit, }, ) => ( {
						increment() {
							commit( ( { state, }, ) => {
								state.count++;
							}, );
						},
						incrementBy( num: number, ) {
							commit( ( { state, }, ) => {
								state.count += num;
							}, );
						},
						decrement() {
							commit( ( { state, }, ) => {
								state.count--;
							}, );
						},
					} ),
				},
			);
		}

		let useConSelector = createSelector();
		afterEach( () => {
			useConSelector = createSelector();
		}, );
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
		it( 'should return the correct state based on the useConSelector selector', () => {
			const { result, } = renderHook( () => useConSelector( props => ( {
				setText: props.wrap(
					'test',
					( props, text: string, ) => {
						props.stateProp = text;
					},
				),
				test: props.state.test,
			} ), ), );

			act( () => {
				result.current.setText( 'new text', );
			}, );

			expect( result.current.test, ).toBe( 'new text', );
		}, );

		it( 'should not trigger other hooks', () => {
			const { result, } = renderHook( () => useConSelector( props => ( {
				setText: props.wrap(
					'test',
					( props, text: string, ) => {
						props.stateProp = text;
					},
				),
				test: props.state.test,
			} ), ), );
			const lastCurrent = result.current;

			const { result: defaultResult, } = renderHook( () => useConSelector(), );

			act( () => {
				defaultResult.current[ 1 ].set( 'state.count', 11, );
			}, );

			expect( result.current, ).toBe( lastCurrent, );
			expect( strictDeepEqual( result.current, lastCurrent, ), ).toBe( true, );
		}, );

		it( 'should return the correct state based createConStore selector', () => {
			const useConSelector = createConStore(
				initialState,
				props => ( {
					setText: props.wrap(
						'test',
						( props, text: string, ) => {
							props.stateProp = text;
						},
					),
					test: props.state.test,
				} ),
			);
			const { result, } = renderHook( () => useConSelector(), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should return the correct state based useConSelector selector and not createConStore selector', () => {
			const useConSelector = createConStore(
				initialState,
				props => ( {
					test: props.state.test,
				} ),
			);
			const { result, } = renderHook( () => useConSelector( props => ( {
				setText: props.wrap(
					'test',
					( props, text: string, ) => {
						props.stateProp = text;
					},
				),
				test: props.state.test,
			} ), ), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should use createConStore selector with acts', () => {
			const useConSelector = createConStore(
				initialState,
				{
					acts( { set, }, ) {
						return {
							setText: ( text: string, ) => {
								set( 'state.test', text, );
							},
						};
					},
				},
				props => ( {
					setText: props.acts.setText,
					test: props.state.test,
				} ),
			);
			const { result, } = renderHook( () => useConSelector(), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should useConSelector with acts and not createConStore selector', () => {
			const useConSelector = createConStore(
				initialState,
				{
					acts( { set, }, ) {
						return {
							setText: ( text: string, ) => {
								set( 'state.test', text, );
							},
						};
					},
				},
				props => ( {
					test: props.state.test,
				} ),
			);
			const { result, } = renderHook( () => useConSelector( props => ( {
				test: props.state.test,
				setText: props.acts.setText,
			} ), ), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );
	}, );
}, );
