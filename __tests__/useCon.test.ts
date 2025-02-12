import { renderHook, act, } from '@testing-library/react';
import { describe, expect, it, } from 'vitest';
import useCon from '../src/useCon';

const initialState = {
	count: 0,
	text: 'hello',
};

describe( 'useCon', () => {
	it( 'should initialize with the correct initial state', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		expect( result.current[ 0 ], ).toBe( initialState, );
	}, );

	it( 'should initialize using callback', () => {
		const { result, } = renderHook( () => useCon( () => initialState, ), );
		expect( result.current[ 0 ], ).toBe( initialState, );
	}, );

	it( 'should only return what default selector sends', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		const props = result.current[ 1 ];
		expect( result.current, ).toStrictEqual( [
			initialState,
			{
				state: props.state,
				initial: props.initial,
				prev: props.prev,
				changes: props.changes,
				prevInitial: props.prevInitial,
				currySet: props.currySet,
				currySetHistory: props.currySetHistory,
				get: props.get,
				getDraft: props.getDraft,
				reset: props.reset,
				set: props.set,
				setHistory: props.setHistory,
				setHistoryWrap: props.setHistoryWrap,
				setWrap: props.setWrap,
				acts: props.acts,
			},
		], );
	}, );

	it( 'should setHistory count correctly', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		expect( result.current[ 0 ], ).toEqual( initialState, );

		act( () => {
			result.current[ 1 ].setHistory( 'state', ( { draft, }, ) => {
				draft.count++;
			}, );
		}, );
		expect( result.current[ 0 ].count, ).toBe( 1, );

		act( () => {
			result.current[ 1 ].setHistory( 'state', ( { draft, }, ) => {
				draft.count--;
			}, );
		}, );

		expect( result.current[ 0 ].count, ).toBe( 0, );
	}, );

	it( 'should not return a new state', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		const oldHistory = result.current;
		act( () => {
			result.current[ 1 ].setHistory( 'state.count', 0, );
		}, );
		const newHistory = result.current;
		expect( oldHistory, ).toBe( newHistory, );
	}, );

	describe( 'selector', () => {
		it( 'should use a custom selector', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setHistory: props.setHistory,
				} ),
			), );

			act( () => {
				result.current.setHistory( 'state.text', 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should not re-render with a custom selector', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.initial.text,
					setHistory: props.setHistory,
				} ),
			), );

			const oldHistory = result.current;
			act( () => {
				result.current.setHistory( 'state.count', 0, );
			}, );
			const newHistory = result.current;
			expect( oldHistory, ).toBe( newHistory, );
		}, );

		it( 'should use a custom selector', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setHistory: props.setHistory,
				} ),
			), );

			act( () => {
				result.current.setHistory( 'state.text', 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should use a custom selector with acts', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				{
					acts( { setHistory, }, ) {
						return {
							setText: ( text: string, ) => {
								setHistory( 'state.text', text, );
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

		it( 'should use a custom selector with custom setter', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: ( text: string, ) => props.setHistory( 'state.text', text, ),
				} ),
			), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should use a custom selector with curry setter', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: props.currySetHistory( 'state.text', ),
				} ),
			), );

			act( () => {
				result.current.setText( 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should use a custom selector with setHistoryWrap', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: props.setHistoryWrap(
						'state.text',
						( props, text: string, ) => {
							props.draft = text;
						},
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
					acts: ( { setHistory, }, ) => ( {
						increment() {
							setHistory( 'state', ( { draft, }, ) => {
								draft.count++;
							}, );
						},
						decrement() {
							setHistory( 'state', ( { draft, }, ) => {
								draft.count--;
							}, );
						},
						incrementBy( num: number, ) {
							setHistory( 'state', ( { draft, }, ) => {
								draft.count += num;
							}, );
						},
						asyncIncrement() {
							return Promise.resolve().then( () => {
								setHistory( 'state', ( { draft, }, ) => {
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
					acts: ( { setHistory, }, ) => ( {
						complexOperation( multiplier: number, ) {
							setHistory( 'state', ( { draft, }, ) => {
								draft.value = draft.value * multiplier + 1;
							}, );
						},
						chainedOperation() {
							setHistory( 'state', ( { draft, }, ) => {
								draft.value += 5;
							}, );
							setHistory( 'state', ( { draft, }, ) => {
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
				result.current[ 1 ].setHistory( 'state', { count: 1, }, );
			}, );

			expect( result.current[ 0 ].count, ).toBe( 1, );

			act( () => {
				result.current[ 1 ].reset();
			}, );

			expect( result.current[ 0 ].count, ).toBe( 0, );
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
