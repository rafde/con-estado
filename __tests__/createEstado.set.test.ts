import { afterEach, describe, } from 'vitest';
import { createEstado, } from '../src/';

describe( 'createEstado.set', () => {
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
		let estado = createEstado( initialObject, );
		let history = estado.get();

		afterEach( () => {
			estado = createEstado( initialObject, );
			history = estado.get();
		}, );

		describe( 'createEstado.set(object)', () => {
			test( 'should have no changes when setting the same state', () => {
				const next = estado.set( {
					state: initialObject,
					initial: initialObject,
				}, );
				expect( history, ).toStrictEqual( next, );
			}, );

			test( 'should set state object', () => {
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
				const next = estado.set( 'state', state, );

				expect( next.state, ).toStrictEqual( state, );
				expect( next.initial, ).toBe( initialObject, );
				expect( next.priorState, ).toStrictEqual( initialObject, );
				expect( next.priorInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( state, );
			}, );
		}, );

		describe( 'createEstado.set(function)', () => {
			test( 'should set a new value by callback', () => {
				const next = estado.set( ( { draft, }, ) => {
					draft.state.n = 11;
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					n: 11,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( { n: 11, }, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );

		describe( 'createEstado.set(stringPathToValue, non-function)', () => {
			test( 'should set a new value by path', () => {
				const changes = {
					n: 3,
				};
				const next = estado.set( 'state.n', changes.n, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
			test( 'should set a new nested value by path', () => {
				const changes = {
					o: {
						on: 7,
					},
				};
				const next = estado.set( 'state.o.on', changes.o.on, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );

		describe( 'createEstado.set(stringPathToValue, function)', () => {
			test( 'should push a new nested value by callback', () => {
				const changes = {
					oo: {
						ooa: [
							1,
							99,
						],
					},
				};
				const next = estado.set( 'state.oo.ooa', ( { draft, }, ) => {
					draft.push( 99, );
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );

			test( 'should push stateProp value by callback', () => {
				const changes = {
					ooo: {
						oooa: [
							...initialObject.ooo.oooa,
							...initialObject.ooo.oooa,
						],
					},
				};
				const next = estado.set( 'state.ooo.oooa', ( { draft, stateProp, }, ) => {
					draft.push( ...stateProp, );
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );

		describe( 'createEstado.set(["array", "path", "to", "value"], non-function)', () => {
			test( 'should set a new array value by path array', () => {
				const changes = {
					oo: {
						ooa: [11,],
					},
				};
				const next = estado.set( ['state', 'oo', 'ooa',], [11,], );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );

		describe( 'createEstado.set(["array", "path", "to", "value"], function)', () => {
			test( 'should modify array by callback using path array', () => {
				const changes = {
					oo: {
						ooa: [1, 100,],
					},
				};
				const next = estado.set( ['state', 'oo', 'ooa',], ( { draft, }, ) => {
					draft.push( 100, );
				}, );

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );
	}, );

	describe( 'array', () => {
		const initialArray = [
			initialObject,
		];

		let estado = createEstado( initialArray, );
		let history = estado.get();
		afterEach( () => {
			estado = createEstado( initialArray, );
			history = estado.get();
		}, );

		describe( 'createEstado.set(array)', () => {
			test( 'should have no changes when setting the same array state', () => {
				const next = estado.set( {
					state: initialArray,
					initial: initialArray,
				}, );
				expect( history, ).toStrictEqual( next, );
			}, );
		}, );

		describe( 'createEstado.set(function)', () => {
			test( 'should set a new value by callback in array', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						n: 11,
					},
				];
				const next = estado.set( ( { draft, }, ) => {
					draft.state[ 0 ].n = changes[ 0 ].n;
				}, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );

			test( 'should push a new value by callback in array', () => {
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
					draft.state.push( item, );
				}, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					undefined,
					item,
				], );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );

		describe( 'createEstado.set(stringPathToValue, non-function)', () => {
			test( 'should set a new array value by string path', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						n: 7,
						o: {
							on: 0,
						},
					},
				];
				const estado = createEstado( initialArray, );
				const next = estado.set( 'state', changes, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( initialArray, );
				expect( next.priorState, ).toStrictEqual( initialArray, );
				expect( next.priorInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( changes, );
			}, );
		}, );

		describe( 'createEstado.set(stringPathToValue, function)', () => {
			test( 'should set a new array value by string path', () => {
				const changes = {
					...initialArray[ 0 ],
					n: 7,
					o: {
						on: 0,
					},
				};
				const next = estado.set( 'state', ( { draft, }, ) => {
					draft[ 1 ] = changes;
				}, );

				expect( next.state, ).toStrictEqual( [...initialArray, changes,], );
				expect( next.initial, ).toBe( initialArray, );
				expect( next.priorState, ).toStrictEqual( initialArray, );
				expect( next.priorInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( [undefined, changes,], );
			}, );
		}, );

		describe( 'createEstado.set([number, "path", "to", "value"], non-function)', () => {
			test( 'should set a new value by array index path', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						n: 3,
					},
				];
				const next = estado.set( ['state', 0, 'n',], changes[ 0 ].n, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );

			test( 'should set a new nested value by array index path', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						o: {
							...initialArray[ 0 ].o,
							on: 7,
						},
					},
				];
				const next = estado.set( ['state', 0, 'o', 'on',], changes[ 0 ].o.on, );

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );

		describe( 'createEstado.set([number, "path", "to", "value"], function)', () => {
			test( 'should set a new nested value by callback in array', () => {
				const item = {
					...initialArray[ 0 ],
					o: {
						...initialArray[ 0 ].o,
						on: 99,
					},
				};

				const next = estado.set( ['state', 0, 'o',], ( { draft, }, ) => {
					draft.on = item.o.on;
				}, );

				expect( next.state, ).toStrictEqual( [
					item,
				], );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					item,
				], );
				expect( next.priorState, ).toBe( history.state, );
				expect( next.priorInitial, ).toStrictEqual( history.priorInitial, );
			}, );
		}, );
	}, );
}, );
