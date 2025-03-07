import { afterEach, describe, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - set', () => {
	const initialObject = {
		n: 1,
		o: {
			on: 2,
		},
		oo: {
			ooa: [
				1,
			],
		},
		ooo: {
			oooa: [
				{
					s: 's',
				},
			],
		},
	};

	describe( 'object', () => {
		let estado = createCon( initialObject, );
		let history = estado.get();

		afterEach( () => {
			estado = createCon( initialObject, );
			history = estado.get();
		}, );

		describe( 'set(object)', () => {
			it( 'should have no changes when setting the same state', () => {
				const next = estado.set( initialObject, );
				expect( history, ).toBe( next, );
			}, );

			it( 'should set state object', () => {
				const state = {
					n: 7,
					o: {
						on: 0,
					},
					oo: {
						ooa: [
							33,
						],
					},
					ooo: {
						oooa: [
							{
								s: 'next',
							},
						],
					},
				};
				const next = estado.set( state, );

				expect( next.state, ).toStrictEqual( state, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.prev, ).toStrictEqual( history.initial, );
				expect( next.prevInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( state, );
			}, );
		}, );

		describe( 'set(function)', () => {
			it( 'should provide correct StringPathProps data structure to updater', () => {
				const changes = {
					s: 'next',
				};
				const initialPropValue = initialObject.ooo.oooa[ 0 ];
				const nextHistory = estado.set( 'ooo.oooa[0]', ( props, ) => {
					// Test StringPathProps properties
					expect( props.changesProp, ).toBeUndefined(); // No changes yet
					expect( props.initialProp, ).toEqual( initialPropValue, );
					expect( props.prevProp, ).toBeUndefined(); // No previous state yet
					expect( props.prevInitialProp, ).toBeUndefined();
					expect( props.stateProp, ).toEqual( initialPropValue, );

					// Make changes using props
					props.draft.s = 'next';
				}, );

				// Verify changes were applied
				expect( nextHistory.state.ooo.oooa[ 0 ], ).toEqual( changes, );

				estado.set( 'ooo.oooa[0]', ( props, ) => {
					// Test StringPathProps properties
					expect( props.changesProp, ).toStrictEqual( changes, );
					expect( props.initialProp, ).toEqual( initialPropValue, );
					expect( props.prevProp, ).toStrictEqual( initialPropValue, );
					expect( props.prevInitialProp, ).toBeUndefined();
					expect( props.stateProp, ).toEqual( changes, );
				}, );
			}, );

			it( 'should provide correct StringPathProps value to updater', () => {
				const changes = 'next';
				const initialPropValue = initialObject.ooo.oooa[ 0 ].s;
				const nextHistory = estado.set( 'ooo.oooa[0].s', ( props, ) => {
					// Test StringPathProps properties
					expect( props.changesProp, ).toBeUndefined(); // No changes yet
					expect( props.initialProp, ).toEqual( initialPropValue, );
					expect( props.prevProp, ).toBeUndefined(); // No previous state yet
					expect( props.prevInitialProp, ).toBeUndefined();
					expect( props.stateProp, ).toEqual( initialPropValue, );

					// Make changes using props
					props.draft = 'next';
				}, );

				// Verify changes were applied
				expect( nextHistory.state.ooo.oooa[ 0 ].s, ).toEqual( changes, );

				estado.set( 'ooo.oooa[0].s', ( props, ) => {
					// Test StringPathProps properties
					expect( props.changesProp, ).toStrictEqual( changes, );
					expect( props.initialProp, ).toEqual( initialPropValue, );
					expect( props.prevProp, ).toStrictEqual( initialPropValue, );
					expect( props.prevInitialProp, ).toBeUndefined();
					expect( props.stateProp, ).toEqual( changes, );
				}, );
			}, );

			it( 'should set a new value by callback', () => {
				const next = estado.set( ( { draft, }, ) => {
					draft.n = 11;
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					n: 11,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( { n: 11, }, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toStrictEqual( history.prevInitial, );
			}, );
		}, );

		describe( 'set(stringPathToValue, non-function)', () => {
			it( 'should set a new value by path', () => {
				const changes = {
					n: 3,
				};
				const next = estado.set( 'n', changes.n, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );
			it( 'should set a new nested value by path', () => {
				const changes = {
					o: {
						on: 7,
					},
				};
				const next = estado.set( 'o.on', changes.o.on, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toStrictEqual( history.prevInitial, );
			}, );
		}, );

		describe( 'set(stringPathToValue, function)', () => {
			it( 'should push a new nested draft value by callback', () => {
				const changes = {
					oo: {
						ooa: [
							undefined,
							99,
						],
					},
				};
				const next = estado.set( 'oo.ooa', ( { draft, }, ) => {
					draft.push( 99, );
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					oo: {
						...initialObject.oo,
						ooa: [
							...initialObject.oo.ooa,
							99,
						],
					},
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should push stateProp draft value by callback', () => {
				const changes = {
					ooo: {
						oooa: [
							undefined,
							...initialObject.ooo.oooa,
						],
					},
				};
				const next = estado.set( 'ooo.oooa', ( { draft, stateProp, }, ) => {
					draft.push( ...stateProp, );
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					ooo: {
						...initialObject.ooo,
						oooa: [
							...initialObject.ooo.oooa,
							...initialObject.ooo.oooa,
						],
					},
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should set primitive value using callback', () => {
				const next = estado.set(
					'n',
					( props, ) => {
						props.draft += 1;
					},
				);
				expect( next.state.n, ).toBe( 2, );
			}, );
		}, );

		describe( 'set(["array", "path", "to", "value"], non-function)', () => {
			it( 'should set a new array value by path array', () => {
				const changes = {
					oo: {
						ooa: [11,],
					},
				};
				const next = estado.set( ['oo', 'ooa',], [11,], );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );
		}, );

		describe( 'set(["array", "path", "to", "value"], function)', () => {
			it( 'should modify draft array by callback using path array', () => {
				const changes = {
					oo: {
						ooa: [undefined, 100,],
					},
				};
				const next = estado.set(
					['oo', 'ooa',],
					( { draft, }, ) => {
						draft.push( 100, );
					},
				);

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					oo: {
						...initialObject.oo,
						ooa: [
							...initialObject.oo.ooa,
							100,
						],
					},
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should set first element in array with callback value', () => {
				const next = estado.set(
					['oo', 'ooa', 0,],
					( props, ) => {
						props.draft += 1;
					},
				);
				expect( next.state.oo.ooa[ 0 ], ).toBe( 2, );
			}, );
		}, );
	}, );

	describe( 'array', () => {
		const initialArray = [
			initialObject,
		];

		let estado = createCon( initialArray, );
		let history = estado.get();
		afterEach( () => {
			estado = createCon( initialArray, );
			history = estado.get();
		}, );

		describe( 'set(array)', () => {
			it( 'should have no changes when setting the same array state', () => {
				const next = estado.set( initialArray, );
				expect( history, ).toStrictEqual( next, );
			}, );
		}, );

		it( 'should have changes', () => {
			const changes = [
				{
					...initialArray[ 0 ],
					n: 11,
				},
			];
			const next = estado.set( changes, );
			expect( next.state, ).toStrictEqual( changes, );
			expect( next.initial, ).toStrictEqual( initialArray, );
			expect( next.prev, ).toBe( initialArray, );
			expect( next.prevInitial, ).toBe( undefined, );
			expect( next.changes, ).toStrictEqual( [
				{
					n: 11,
				},
			], );
		}, );

		describe( 'set(function)', () => {
			it( 'should set a new value by callback in array', () => {
				const estado = createCon( initialArray, );
				const changes = [
					{
						n: 11,
					},
				];
				const next = estado.set( ( { draft, }, ) => {
					draft[ 0 ].n = 11;
				}, );
				const newState = [...initialArray,];
				newState[ 0 ] = {
					...newState[ 0 ],
					n: 11,
				};

				expect( next.state, ).toStrictEqual( newState, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should push a new value by callback in array', () => {
				const item = {
					...initialArray[ 0 ],
					n: 7,
					o: {
						on: 0,
					},
				};
				const changes = [
					...initialArray,
					item,
				];
				const next = estado.set( ( { draft, }, ) => {
					draft.push( item, );
				}, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					undefined,
					item,
				], );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );
		}, );

		describe( 'set(stringPathToValue, non-function)', () => {
			it( 'should set a new array value by string path', () => {
				const changes = {
					n: 7,
					o: {
						on: 0,
					},
				};
				const newState = [
					{
						...initialArray[ 0 ],
						...changes,
					},
				];
				const estado = createCon( initialArray, );
				const next = estado.set( newState, );

				expect( next.state, ).toStrictEqual( newState, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [changes,], );
				expect( next.prev, ).toBe( history.initial, );
				expect( next.prevInitial, ).toBe( undefined, );
			}, );
		}, );

		describe( 'set(stringPathToValue, function)', () => {
			it( 'should set draft with a new array value by string path', () => {
				const changes = {
					...initialArray[ 0 ],
					n: 7,
					o: {
						on: 0,
					},
				};
				const next = estado.set( ( { draft, }, ) => {
					draft[ 1 ] = changes;
				}, );

				expect( next.state, ).toStrictEqual( [...initialArray, changes,], );
				expect( next.initial, ).toBe( initialArray, );
				expect( next.prev, ).toBe( history.initial, );
				expect( next.prevInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( [undefined, changes,], );
			}, );
		}, );

		describe( 'set([number, "path", "to", "value"], non-function)', () => {
			it( 'should set a new value by array index path', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						n: 3,
					},
				];
				const next = estado.set( [0, 'n',], changes[ 0 ].n, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [{ n: 3, },], );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should set a new nested value by array index path', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						o: {
							...initialArray[ 0 ].o,
							on: 7,
						},
					},
				];
				const next = estado.set( [0, 'o', 'on',], changes[ 0 ].o.on, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [{ o: { on: 7, }, },], );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );
		}, );

		describe( 'set([number, "path", "to", "value"], function)', () => {
			it( 'should set a new nested value by callback in array', () => {
				const item = {
					...initialArray[ 0 ],
					o: {
						...initialArray[ 0 ].o,
						on: 99,
					},
				};

				const next = estado.set(
					[0, 'o',],
					( { draft, }, ) => {
						draft.on = item.o.on;
					},
				);

				expect( next.state, ).toStrictEqual( [
					item,
				], );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					{
						o: {
							on: 99,
						},
					},
				], );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );
		}, );
	}, );
}, );
