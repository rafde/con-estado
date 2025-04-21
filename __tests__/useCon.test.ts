import { renderHook, act, } from '@testing-library/react';
import { describe, expect, it, } from 'vitest';
import { useCon, } from '../src/';

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
				acts: props.acts,
				commit: props.commit,
				get: props.get,
				// getDraft: props.getDraft,
				merge: props.merge,
				reset: props.reset,
				set: props.set,
				wrap: props.wrap,
				state: props.state,
				subscribe: props.subscribe,
				useSelector: props.useSelector,
			},
		], );
	}, );

	it( 'should setHistory count correctly', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		expect( result.current[ 0 ], ).toEqual( initialState, );

		act( () => {
			result.current[ 1 ].commit( ( { state, }, ) => {
				state.count++;
			}, );
		}, );
		expect( result.current[ 0 ].count, ).toBe( 1, );

		act( () => {
			result.current[ 1 ].commit( ( { state, }, ) => {
				state.count--;
			}, );
		}, );

		expect( result.current[ 0 ].count, ).toBe( 0, );
	}, );

	it( 'should not return a new state', () => {
		const { result, } = renderHook( () => useCon( initialState, ), );
		const oldHistory = result.current;
		act( () => {
			result.current[ 1 ].set( 'state.count', 0, );
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
					set: props.set,
				} ),
			), );

			act( () => {
				result.current.set( 'state.text', 'world', );
			}, );

			expect( result.current.test, ).toBe( 'world', );
		}, );

		it( 'should not re-render with a custom selector', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.get( 'initial.text', ),
					set: props.set,
				} ),
			), );

			const oldHistory = result.current;
			act( () => {
				result.current.set( 'state.count', 0, );
			}, );
			const newHistory = result.current;
			expect( oldHistory, ).toBe( newHistory, );
		}, );

		it( 'should use a custom selector', () => {
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

		it( 'should use a custom selector with acts', () => {
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

		it( 'should use a custom selector with custom setter', () => {
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

		it( 'should use a custom selector with setHistoryWrap', () => {
			const { result, } = renderHook( () => useCon(
				initialState,
				props => ( {
					test: props.state.text,
					setText: props.wrap(
						'text',
						( props, text: string, ) => {
							props.stateProp = text;
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

	describe( 'useSelector', () => {
		it( 'should useCon default useSelector return to update ', () => {
			const { result, } = renderHook( () => useCon( initialState, ), );
			const { result: sResults, } = renderHook( () => result.current[ 1 ].useSelector(), );

			act( () => {
				sResults.current[ 1 ].set( 'state.count', 11, );
			}, );
			expect( result.current[ 0 ].count, ).toBe( 11, );
			expect( sResults.current[ 0 ].count, ).toBe( 11, );
		}, );

		it( 'should useCon useSelector selector to update ', () => {
			const { result, } = renderHook( () => useCon( initialState, ), );
			const { result: sResults, } = renderHook( () => result.current[ 1 ].useSelector( props => ( {
				count: props.state.count,
				set: props.set,
			} ), ), );

			act( () => {
				sResults.current.set( 'state.count', 11, );
			}, );
			expect( result.current[ 0 ].count, ).toBe( 11, );
			expect( sResults.current.count, ).toBe( 11, );

			const oldS = sResults.current;
			act( () => {
				result.current[ 1 ].set( 'state.text', 'test', );
			}, );

			expect( oldS, ).toBe( sResults.current, );
		}, );

		it( 'should useCon selector to return useSelector to update ', () => {
			const { result, } = renderHook( () => useCon( initialState, props => props.useSelector, ), );
			const old = result.current;
			const { result: sResults, } = renderHook( () => result.current(), );

			act( () => {
				sResults.current[ 1 ].set( 'state.count', 11, );
			}, );
			expect( sResults.current[ 0 ].count, ).toBe( 11, );
			expect( result.current, ).toBe( old, );
		}, );

		it( 'should useCon selector to return useSelector selected result to update', () => {
			const { result, } = renderHook( () => useCon( initialState, props => props.useSelector, ), );
			const old = result.current;
			const { result: sResults, } = renderHook( () => result.current( props => ( {
				count: props.state.count,
				set: props.set,
			} ), ), );

			act( () => {
				sResults.current.set( 'state.count', 11, );
			}, );
			expect( sResults.current.count, ).toBe( 11, );
			expect( result.current, ).toBe( old, );
		}, );

		it( 'should not update useCon with useSelector', () => {
			const { result, } = renderHook( () => useCon( initialState, ), );
			const { result: sResults, } = renderHook( () => result.current[ 1 ].useSelector( props => ( {
				text: props.state.text,
				set: props.set,
			} ), ), );
			const old = sResults.current;

			act( () => {
				result.current[ 1 ].set( 'state.count', 11, );
			}, );
			expect( result.current[ 0 ].count, ).toBe( 11, );
			expect( sResults.current, ).toBe( old, );
		}, );
	}, );

	describe( 'acts', () => {
		it( 'should update state correctly when actions are dispatched', async() => {
			const { result, } = renderHook( () => useCon(
				initialState,
				{
					acts: ( { commit, }, ) => ( {
						increment() {
							commit( ( { state, }, ) => {
								state.count++;
							}, );
						},
						decrement() {
							commit( ( { state, }, ) => {
								state.count--;
							}, );
						},
						incrementBy( num: number, ) {
							commit( ( { state, }, ) => {
								state.count += num;
							}, );
						},
						asyncIncrement() {
							return Promise.resolve().then( () => {
								commit( ( { state, }, ) => {
									state.count++;
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
					acts: ( { commit, }, ) => ( {
						complexOperation( multiplier: number, ) {
							commit( ( { state, }, ) => {
								state.value = state.value * multiplier + 1;
							}, );
						},
						chainedOperation() {
							commit( ( { state, }, ) => {
								state.value += 5;
							}, );
							commit( ( { state, }, ) => {
								state.value *= 2;
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

	describe.skip( 'useCon - getDraft', () => {
		it( 'should update state when history changes after finalize', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );

			// @ts-expect-error disabled for now
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

			// @ts-expect-error disabled for now
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

	describe( 'useCon - inner calls', () => {
		it( 'should work when set is called within commit', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );
			// const oldState = result.current[ 0 ];
			act( () => {
				result.current[ 1 ].commit( ( props, ) => {
					result.current[ 1 ].set( 'state.count', 1, );
					expect( props.state.count, ).toBe( 1, );
				}, );
			}, );
		}, );

		it( 'should work when merge is called within commit', () => {
			const initialState = {
				count: 0,
				count2: 0,
			};
			const { result, } = renderHook( () => useCon( initialState, ), );
			// const oldState = result.current[ 0 ];
			act( () => {
				result.current[ 1 ].commit( ( props, ) => {
					result.current[ 1 ].merge( 'state', { count: 1, }, );
					expect( props.state.count, ).toBe( 1, );
				}, );
			}, );
		}, );

		it( 'should work when reset is called within commit', () => {
			const initialState = {
				count: 0,
				count2: 0,
			};
			const { result, } = renderHook( () => useCon( initialState, ), );
			// const oldState = result.current[ 0 ];
			act( () => {
				result.current[ 1 ].merge( 'state', { count: 1, }, );
			}, );
			expect( result.current[ 0 ].count, ).toBe( 1, );

			act( () => {
				result.current[ 1 ].commit( () => {
					expect( () => {
						result.current[ 1 ].reset();
					}, ).toThrowError( /in progress/, );
				}, );
			}, );
		}, );

		it( 'should work when set is called within wrap', () => {
			const initialState = { count: 0, };
			const { result, } = renderHook( () => useCon( initialState, ), );
			const w = result.current[ 1 ].wrap(
				( props, ) => {
					result.current[ 1 ].set( 'state.count', 1, );
					expect( props.state.count, ).toBe( 1, );
				},
			);
			// const oldState = result.current[ 0 ];
			act( () => {
				w();
			}, );
		}, );

		it( 'should work when merge is called within wrap', () => {
			const initialState = {
				count: 0,
				count2: 0,
			};
			const { result, } = renderHook( () => useCon( initialState, ), );
			const w = result.current[ 1 ].wrap( ( props, ) => {
				result.current[ 1 ].merge( 'state', { count: 1, }, );
				expect( props.state.count, ).toBe( 1, );
			}, );
			// const oldState = result.current[ 0 ];
			act( () => {
				w();
			}, );
		}, );

		it( 'should work when reset is called within wrap', () => {
			const initialState = {
				count: 0,
				count2: 0,
			};
			const { result, } = renderHook( () => useCon( initialState, ), );
			const w = result.current[ 1 ].wrap( () => {
				expect( () => {
					result.current[ 1 ].reset();
				}, ).toThrowError( /in progress/, );
			}, );
			// const oldState = result.current[ 0 ];
			act( () => {
				result.current[ 1 ].merge( 'state', { count: 1, }, );
			}, );
			expect( result.current[ 0 ].count, ).toBe( 1, );

			act( () => {
				w();
			}, );
		}, );
	}, );
}, );
