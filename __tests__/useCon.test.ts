import { renderHook, act, } from '@testing-library/react';
import { describe, expect, } from 'vitest';
import useCon from '../src/useCon';

const initialState = {
	count: 0,
	text: 'hello',
};

describe( 'useCon', () => {
	test( 'should initialize with the correct initial state', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		expect( result.current[ 0 ], ).toEqual( initialState, );
	}, );

	test( 'should set count correctly', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		expect( result.current[ 0 ], ).toEqual( initialState, );

		act( () => {
			result.current[ 1 ].set( 'state', ( { state, }, ) => {
				state.count++;
			}, );
		}, );
		expect( result.current[ 0 ].count, ).toBe( 1, );

		act( () => {
			result.current[ 1 ].set( 'state', ( { state, }, ) => {
				state.count--;
			}, );
		}, );

		expect( result.current[ 0 ].count, ).toBe( 0, );
	}, );

	test( 'should not return a new state', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		const oldHistory = result.current[ 1 ].get();
		const oldState = result.current[ 0 ];
		act( () => {
			result.current[ 1 ].set( 'state.count', 0, );
		}, );
		const newHistory = result.current[ 1 ].get();
		const newState = result.current[ 0 ];
		expect( oldHistory, ).toBe( newHistory, );
		expect( oldState, ).toBe( newState, );
	}, );

	describe( 'selector', () => {
		test( 'should use a custom selector', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					set: props.set,
				} ),
			), );

			act( () => {
				result.current.set( 'state.text', 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		test( 'should use a custom selector with acts', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				{
					acts( { set, }, ) {
						return {
							setText: ( text: string, ) => {
								set( 'state.text', text, );
							},
						};
					},
				},
				props => ( {
					setText: props.acts.setText,
					test: props.state.text,
				} ),
			), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		test( 'should use a custom selector with custom setter', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: ( text: string, ) => props.set( 'state.text', text, ),
				} ),
			), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		test( 'should use a custom selector with curry setter', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: props.currySet( 'state.text', ),
				} ),
			), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		test( 'should use a custom selector with setWrap', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: props.setWrap(
						'state.text',
						( _, text: string, ) => text,
					),
				} ),
			), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );

			act( () => {
				result.current.setText( 'hi', );
			}, );

			expect( result.current.test, ).toBe( 'hi', );
		}, );
	}, );

	describe( 'acts', () => {
		it( 'should update state correctly when actions are dispatched', async() => {
			const { result, } = renderHook( () => useCon(
				initialState,
				{
					acts: ( { set, }, ) => ( {
						increment() {
							set( 'state', ( { draft, }, ) => {
								draft.count++;
							}, );
						},
						decrement() {
							set( 'state', ( { draft, }, ) => {
								draft.count--;
							}, );
						},
						incrementBy( num: number, ) {
							set( 'state', ( { draft, }, ) => {
								draft.count += num;
							}, );
						},
						asyncIncrement() {
							return Promise.resolve().then( () => {
								set( 'state', ( { draft, }, ) => {
									draft.count++;
								}, );
							}, );
						},
					} ),
				},
			), );
			act( () => {
				result.current[ 1 ].acts.increment();
			}, );

			expect( result.current[ 0 ].count, ).toBe( 1, );

			act( () => {
				result.current[ 1 ].acts.decrement();
			}, );

			expect( result.current[ 0 ].count, ).toBe( 0, );

			act( () => {
				result.current[ 1 ].acts.incrementBy( 10, );
			}, );

			expect( result.current[ 0 ].count, ).toBe( 10, );

			act( () => {
				result.current[ 1 ].acts.incrementBy( -10, );
			}, );

			expect( result.current[ 0 ].count, ).toBe( 0, );

			await act( async() => await result.current[ 1 ].acts.asyncIncrement(), );

			expect( result.current[ 0 ].count, ).toBe( 1, );
		}, );

		it( 'should handle complex action combinations', () => {
			const { result, } = renderHook( () => useCon(
				{ value: 0, },
				{
					acts: ( { set, }, ) => ( {
						complexOperation( multiplier: number, ) {
							set( 'state', ( { draft, }, ) => {
								draft.value = draft.value * multiplier + 1;
							}, );
						},
						chainedOperation() {
							set( 'state', ( { draft, }, ) => {
								draft.value += 5;
							}, );
							set( 'state', ( { draft, }, ) => {
								draft.value *= 2;
							}, );
						},
					} ),
				},
			), );

			act( () => {
				result.current[ 1 ].acts.complexOperation( 3, );
			}, );
			expect( result.current[ 0 ].value, ).toBe( 1, );

			act( () => {
				result.current[ 1 ].acts.chainedOperation();
			}, );
			expect( result.current[ 0 ].value, ).toBe( 12, );
		}, );
	}, );

	describe( 'useCon - getDraft', () => {
		it( 'should update state when history changes after finalize', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );

			const [draft, finalize,] = result.current[ 1 ].getDraft();
			draft.state.count = 1;

			act( () => {
				finalize();
			}, );

			const updatedState = result.current[ 0 ];
			expect( updatedState.count, ).toBe( 1, );
		}, );

		it( 'should not update state when history remains unchanged after finalize', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );

			const [, finalize,] = result.current[ 1 ].getDraft();

			act( () => {
				finalize();
			}, );

			const updatedState = result.current[ 0 ];
			expect( updatedState.count, ).toBe( 0, );
		}, );
	}, );

	describe( 'useCon - reset', () => {
		it( 'should reset the state to the initial state', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );

			act( () => {
				result.current[ 1 ].set( 'state', { count: 1, }, );
			}, );

			act( () => {
				result.current[ 1 ].reset();
			}, );

			const updatedState = result.current[ 0 ];
			expect( updatedState.count, ).toBe( 0, );
		}, );

		it( 'should not update state when history remains unchanged after reset', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );
			const oldState = result.current[ 0 ];
			act( () => {
				result.current[ 1 ].reset();
			}, );

			const updatedState = result.current[ 0 ];
			expect( oldState, ).toBe( updatedState, );
		}, );
	}, );
}, );
