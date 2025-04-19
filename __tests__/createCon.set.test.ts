import { afterEach, describe, } from 'vitest';
import createCon from '../src/_internal/createCon';
import type { DeepPartial, } from 'src/types/DeepPartial';

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
					's.s': 's.s',
				},
			],
		},
		'.s': {
			'.s.s': '.s.s',
		},
		's.s[1]': {
			's.s[1]': 's.s[1]',
		},
		'[0]': {
			'[0]': [[0,],],
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
				estado.set( {
					state: initialObject,
					initial: initialObject,
				}, );
				const next = estado.get();
				expect( history, ).toStrictEqual( next, );
			}, );

			it( 'should have changes', () => {
				const changes = {
					state: {
						...initialObject,
						n: 11,
					},
					initial: initialObject,
				};
				estado.set( changes, );
				const next = estado.get();
				expect( next.state, ).toStrictEqual( changes.state, );
				expect( next.initial, ).toStrictEqual( changes.initial, );
				expect( next.prev, ).toBe( initialObject, );
				expect( next.prevInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( { n: 11, }, );
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
								s: 's next',
								's.s': 's.s next',
							},
						],
					},
					'.s': {
						'.s.s': '.s.s next',
					},
					's.s[1]': {
						's.s[1]': 's.s[1] next',
					},
					'[0]': {
						'[0]': [[1,],],
					},
				};
				estado.set( 'state', state, );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( state, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.prev, ).toStrictEqual( history.initial, );
				expect( next.prevInitial, ).toBe( undefined, );
				expect( next.changes, ).toStrictEqual( state, );
			}, );
		}, );

		describe( 'set(stringPathToValue, non-function)', () => {
			it( 'should set a new value by path', () => {
				const changes = {
					ooo: {
						oooa: [{
							s: 's',
							's.s': 'next',
						},],
					},
				};
				estado.set( 'state.ooo.oooa[0].s\\.s', changes.ooo.oooa[ 0 ][ 's.s' ], );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( {
					ooo: {
						oooa: [{
							's.s': 'next',
						},],
					},
				}, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should set for complex path', () => {
				const changes = {
					'[0]': {
						'[0]': [[7,],],
					},
					's.s[1]': {
						's.s[1]': 'next2',
					},
				};
				estado.set( 'state.\\[0].\\[0][0][0]', 7, );
				const prev = estado.get();

				estado.set( 'state.s\\.s\\[1].s\\.s\\[1]', 'next2', );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toStrictEqual( prev.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );

			it( 'should set a new nested value by path', () => {
				const changes = {
					o: {
						on: 7,
					},
				};

				estado.set( 'state.o.on', changes.o.on, );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( {
					...initialObject,
					...changes,
				}, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( changes, );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toStrictEqual( history.prevInitial, );
			}, );

			describe( 'update partial state', () => {
				const initial = {} as DeepPartial<typeof initialObject>;
				let estado = createCon( initial, );

				afterEach( () => {
					estado = createCon( initial, );
				}, );

				it( 'should set with undefined nested value by string path', () => {
					const changes = {
						o: {
							on: 2,
						},
					};
					estado.set( 'state.o.on', 2, );
					const next = estado.get();
					expect( next.state, ).toStrictEqual( changes, );
					expect( next.initial, ).toStrictEqual( initial, );
					expect( next.prev, ).toBe( initial, );
					expect( next.prevInitial, ).toBe( undefined, );
					expect( next.changes, ).toStrictEqual( changes, );
				}, );

				it( 'should set with undefined nested value by index', () => {
					let changes = {
						oo: {
							ooa: [
								,
								,
								2,
							],
						},
					};
					let prev = initial;

					estado.set( 'state.oo.ooa[2]', 2, );
					let next = estado.get();

					expect( next.state, ).toStrictEqual( changes, );
					expect( next.initial, ).toStrictEqual( initial, );
					expect( next.prev, ).toBe( prev, );
					expect( next.prevInitial, ).toBe( undefined, );
					expect( next.changes, ).toStrictEqual( changes, );

					changes = {
						oo: {
							ooa: [
								,
								-2,
								2,
							],
						},
					};

					prev = next.state as typeof initial;
					estado.set( 'state.oo.ooa[-2]', -2, );
					next = estado.get();
					expect( next.state, ).toStrictEqual( changes, );
					expect( next.initial, ).toStrictEqual( initial, );
					expect( next.prev, ).toBe( prev, );
					expect( next.prevInitial, ).toBe( undefined, );
					expect( next.changes, ).toStrictEqual( changes, );
				}, );
			}, );
		}, );

		describe( 'set(["array", "path", "to", "value"], non-function)', () => {
			it( 'should set a new array value by path array', () => {
				const changes = {
					oo: {
						ooa: [11,],
					},
				};
				estado.set( ['state', 'oo', 'ooa',], [11,], );
				const next = estado.get();

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
				estado.set( {
					state: initialArray,
					initial: initialArray,
				}, );
				const next = estado.get();
				expect( history, ).toStrictEqual( next, );
			}, );
		}, );

		it( 'should have changes', () => {
			const changes = {
				state: [
					{
						...initialArray[ 0 ],
						n: 11,
					},
				],
				initial: initialArray,
			};
			estado.set( changes, );
			const next = estado.get();
			expect( next.state, ).toStrictEqual( changes.state, );
			expect( next.initial, ).toStrictEqual( changes.initial, );
			expect( next.prev, ).toBe( initialArray, );
			expect( next.prevInitial, ).toBe( undefined, );
			expect( next.changes, ).toStrictEqual( [
				{
					n: 11,
				},
			], );
		}, );

		describe( 'set(stringPathToValue, non-function)', () => {
			it( 'should set a new array value by string path', () => {
				const changes = [
					{
						...initialArray[ 0 ],
						n: 7,
						o: {
							on: 0,
						},
					},
				];
				const estado = createCon( initialArray, );
				estado.set( 'state', changes, );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					{
						n: 7,
						o: {
							on: 0,
						},
					},
				], );
				expect( next.prev, ).toBe( history.initial, );
				expect( next.prevInitial, ).toBe( undefined, );
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
				estado.set( ['state', 0, 'n',], changes[ 0 ].n, );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					{
						n: 3,
					},
				], );
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
				estado.set( ['state', 0, 'o', 'on',], changes[ 0 ].o.on, );
				const next = estado.get();

				expect( next.state, ).toStrictEqual( changes, );
				expect( next.initial, ).toBe( history.initial, );
				expect( next.changes, ).toStrictEqual( [
					{
						o: {
							on: 7,
						},
					},
				], );
				expect( next.prev, ).toBe( history.state, );
				expect( next.prevInitial, ).toBe( history.prevInitial, );
			}, );
		}, );
	}, );

	describe( 'set edge cases', () => {
		it( 'should handle null prototype objects', () => {
			const con = createCon( { count: 0, }, );
			expect( () => {
				// @ts-expect-error -- testing empty set
				con.set();
			}, ).toThrowError( 'Invalid state path', );
		}, );

		it( 'should handle empty arrays', () => {
			const estado = createCon( [] as number[], );
			estado.set( 'state', [1, 2, 3,], );
			const next = estado.get();
			expect( next.state, ).toEqual( [1, 2, 3,], );

			estado.set( 'state', [], );
			const next2 = estado.get();
			expect( next2.state, ).toEqual( [], );
		}, );

		it( 'should handle sparse arrays', () => {
			const estado = createCon( [1, 2, 3,] as Array<number | undefined>, );

			estado.set( 'state', [,, 5,], );
			const next = estado.get();
			expect( next.state, ).toEqual( [, , 5,], );

			estado.set( ['state', 1,], 1, );
			const next2 = estado.get();
			expect( next2.state, ).toEqual( [, 1, 5,], );
		}, );

		it( 'should handle deeply nested sparse arrays', () => {
			const estado = createCon( {
				matrix: [[1, 2,], [3, 4,],] as Array<Array<number | undefined> | undefined>,
			}, );

			estado.set( 'state.matrix', [, [, 5,],], );
			const next = estado.get();
			expect( next.state.matrix, ).toEqual( [, [, 5,],], );
		}, );

		it( 'should handle array with mixed types', () => {
			const estado = createCon( [
				1,
				{ id: 2,
					value: 'two', },
				'three',
				[4, 5,],
			] as ( number | { id: number
				value: string } | string | number[] )[], );

			estado.set( ['state', 1,], {
				id: 20,
				value: 'twenty',
			}, );
			const next = estado.get();

			expect( next.state[ 1 ], ).toEqual( {
				id: 20,
				value: 'twenty',
			}, );

			estado.set( ['state', 3, 0,], 40, );
			const next2 = estado.get();
			expect( next2.state[ 3 ], ).toEqual( [40, 5,], );
		}, );

		it( 'should handle array with object that has optional properties', () => {
			type Item = {
				id: number
				value?: string
				meta?: {
					tags?: string[]
					active?: boolean
				}
			};

			const estado = createCon( [
				{ id: 1, },
				{ id: 2,
					value: 'two', },
			] as Item[], );

			estado.set( ['state', 0,], {
				id: 1,
				meta: { tags: ['new',], },
			}, );

			const next = estado.get();

			expect( next.state[ 0 ], ).toEqual( {
				id: 1,
				meta: { tags: ['new',], },
			}, );

			estado.set( 'state[0].meta.active', true, );
			const next2 = estado.get();
			expect( next2.state[ 0 ].meta?.active, ).toBe( true, );
		}, );

		it( 'should handle array index out of bounds', () => {
			const estado = createCon( [1, 2,] as number[], );

			estado.set( ['state', 5,], 6, );
			const next = estado.get();
			expect( next.state, ).toEqual( [1, 2, undefined, undefined, undefined, 6,], );

			estado.set( 'state[10]', 10, );
			const next2 = estado.get();
			expect( next2.state, ).toEqual( [1, 2, undefined, undefined, undefined, 6, undefined, undefined, undefined, undefined, 10,], );
		}, );

		it( 'should handle complex nested path updates', () => {
			type State = {
				users: {
					[key: string]: {
						[key: string]: Array<{
							id: number
							comments: Array<{
								id: number
								text: string
							}>
						}>
					}
				}
			};

			const con = createCon( {
				users: {
					user1: {
						posts: [
							{
								id: 1,
								comments: [
									{
										id: 1,
										text: 'first',
									},
								],
							},
						],
					},
				},
			} as State, );

			con.set( 'state.users.user1\\.1.posts[0].comments[0].text', 'updated', );
			expect( con.get().state.users[ 'user1.1' ].posts[ 0 ].comments[ 0 ].text, ).toBe( 'updated', );

			con.set( 'state.users.user1\\.2.megaPosts[5].comments[2].text', 'updated', );
			expect( con.get().state.users[ 'user1.2' ].megaPosts[ 5 ].comments[ 2 ].text, ).toBe( 'updated', );
		}, );
	}, );

	describe( 'set error cases', () => {
		it( 'should throw error when object has neither state nor initial properties', () => {
			const estado = createCon( {
				n: 1,
				o: {
					on: 2,
				},
			}, );

			expect( () => {
				estado.set( {
					// @ts-expect-error -- testing invalid input
					invalidProp: 'value',
				}, );
			}, ).toThrowError( '`state` or `initial` properties', );

			expect( () => {
				// @ts-expect-error -- testing invalid input
				estado.set( {}, );
			}, ).toThrowError( '`state` or `initial` properties', );
		}, );

		it( 'should throw error when path is invalid', () => {
			const estado = createCon( {
				a: [],
				n: 1,
				o: {
					on: 2,
				},
			}, );

			expect( () => {
				// @ts-expect-error -- testing invalid input
				estado.set( 'state.a[-1]', 'value', );
			}, ).toThrowError( 'out of bounds for array length', );

			expect( () => {
				// @ts-expect-error -- testing invalid input
				estado.set( 123, 'value', );
			}, ).toThrowError( 'Invalid state path', );

			expect( () => {
				// @ts-expect-error -- testing invalid input
				estado.set( true, 'value', );
			}, ).toThrowError( 'Invalid state path', );

			expect( () => {
				// @ts-expect-error -- testing invalid input
				estado.set( { invalid: 'path', }, 'value', );
			}, ).toThrowError( '`state` or `initial` properties', );

			expect( () => {
				const history = estado.get();
				// @ts-expect-error -- testing invalid input
				history.state = 'value';
			}, ).toThrowError( /trap returned falsish/, );

			// Valid cases should not throw
			expect( () => {
				estado.set( ['state', 'n',], 2, );
			}, ).not.toThrow();

			expect( () => {
				estado.set( 'state.n', 2, );
			}, ).not.toThrow();
		}, );
	}, );
}, );
