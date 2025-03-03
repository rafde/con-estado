import { describe, it, expect, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - mergeHistory', () => {
	it( 'should merge when given only initial', () => {
		const con = createCon( {
			count: 0,
			data: { value: 'test', },
		}, );

		con.mergeHistory( {
			initial: {
				data: {
					value: 'updated',
				},
			},
		}, );

		expect( con.get( 'initial', ), ).toEqual( {
			count: 0,
			data: { value: 'updated', },
		}, );
	}, );

	it( 'should merge when given only state', () => {
		const con = createCon( {
			count: 0,
			data: { value: 'test', },
		}, );

		con.mergeHistory( {
			state: {
				data: { value: 'updated', },
			},
		}, );

		expect( con.get( 'state', ), ).toEqual( {
			count: 0,
			data: { value: 'updated', },
		}, );
	}, );

	it( 'should merge when given both initial and state', () => {
		const con = createCon( {
			count: 0,
			data: { value: 'test', },
			noChange: 'none',
		}, );

		con.mergeHistory( {
			initial: {
				data: { value: 'initial', },
			},
			state: {
				count: 2,
				data: { value: 'updated', },
			},
		}, );

		expect( con.get( 'state', ), ).toEqual( {
			count: 2,
			data: { value: 'updated', },
			noChange: 'none',
		}, );
		expect( con.get( 'initial', ), ).toEqual( {
			count: 0,
			data: { value: 'initial', },
			noChange: 'none',
		}, );
	}, );

	it( 'should handle nested structures', () => {
		const con = createCon( {
			nested: {
				a: { value: 1, },
				b: { value: 2, },
			},
			noChange: 'none',
		}, );

		con.mergeHistory( {
			initial: {
				nested: {
					b: { value: 4, },
				},
			},
			state: {
				nested: {
					a: { value: 5, },
				},
			},
		}, );

		expect( con.get( 'initial', ), ).toEqual( {
			nested: {
				a: { value: 1, },
				b: { value: 4, },
			},
			noChange: 'none',
		}, );
		expect( con.get( 'state', ), ).toEqual( {
			nested: {
				a: { value: 5, },
				b: { value: 2, },
			},
			noChange: 'none',
		}, );
	}, );

	it( 'should handle arrays', () => {
		const con = createCon( [1, 2, 3, 4,], );

		con.mergeHistory( {
			initial: [4, 5, 6,],
			state: [7, 8, 9,],
		}, );

		expect( con.get( 'initial', ), ).toEqual( [4, 5, 6, 4,], );
		expect( con.get( 'state', ), ).toEqual( [7, 8, 9, 4,], );
	}, );

	it( 'should handle array source with longer target length', () => {
		const con = createCon( [1, 2,], );

		con.mergeHistory( {
			state: [7, 8, 9, 10, 11, 12,],
		}, );

		expect( con.get( 'state', ), ).toEqual( [7, 8, 9, 10, 11, 12,], );
	}, );

	it( 'should handle sparse array source with longer target length', () => {
		const con = createCon( [1, 2, 3, 4, 5,], );

		con.mergeHistory( {
			state: [2, , , 8, 11, 12,],
		}, );

		expect( con.get( 'state', ), ).toEqual( [2, 2, 3, 8, 11, 12,], );
	}, );

	it( 'should handle null and undefined values', () => {
		const con = createCon( {
			a: null as null | number,
			b: undefined as undefined | number,
			c: 1 as null | number | undefined,
		}, );

		con.mergeHistory( {
			initial: {
				a: 1,
				b: 2,
				c: null,
			},
			state: {
				a: null,
				b: 3,
				c: undefined,
			},
		}, );

		expect( con.get( 'state', ), ).toEqual( {
			a: null,
			b: 3,
			c: undefined,
		}, );
		expect( con.get( 'initial', ), ).toEqual( {
			a: 1,
			b: 2,
			c: null,
		}, );
	}, );

	it( 'should handle deeply nested structures with conflicting keys', () => {
		const con = createCon( {
			level1: {
				level2: {
					level3: {
						propA: 'original',
						propB: 'valueB',
						propD: undefined as undefined | string,
					},
					propC: 'valueC',
					propD: undefined as undefined | string,
				},
			},
			noChange: 'none',
		}, );

		con.mergeHistory( {
			initial: {
				level1: {
					level2: {
						level3: {
							propA: 'initial',
						},
					},
				},
			},
			state: {
				level1: {
					level2: {
						level3: {
							propB: 'updated',
							propD: 'newProp',
						},
					},
				},
			},
		}, );

		expect( con.get( 'initial', ), ).toEqual( {
			level1: {
				level2: {
					level3: {
						propA: 'initial',
						propB: 'valueB',
					},
					propC: 'valueC',
				},
			},
			noChange: 'none',
		}, );
		expect( con.get( 'state', ), ).toEqual( {
			level1: {
				level2: {
					level3: {
						propA: 'original',
						propB: 'updated',
						propD: 'newProp',
					},
					propC: 'valueC',
				},
			},
			noChange: 'none',
		}, );
	}, );

	it( 'should handle deeply nested structures with conflicting keys', () => {
		const con = createCon( {
			noChange: 'none',
		} as {
			level1?: {
				level2?: {
					level3?: {
						propA?: string
						propB?: string
						propD?: string
					}
					propC?: string
				}
			}
			noChange?: string
		}, );

		con.mergeHistory( {
			state: {
				level1: {
					level2: {
						level3: {
							propB: 'updated',
							propD: 'newProp',
						},
					},
				},
			},
		}, );

		expect( con.get( 'state', ), ).toEqual( {
			level1: {
				level2: {
					level3: {
						propB: 'updated',
						propD: 'newProp',
					},
				},
			},
			noChange: 'none',
		}, );
	}, );

	it( 'should handle large objects and ensure performance', () => {
		const largeInitial = { items: Array.from( { length: 10000, }, ( _, i, ) => i, ), };
		const largeState = { items: Array.from( { length: 10000, }, ( _, i, ) => i + 10000, ), };

		const con = createCon( {
			...largeInitial,
			noChange: 'none',
		}, );

		con.mergeHistory( {
			state: largeState,
		}, );

		expect( con.get( 'state', ), ).toEqual( {
			...largeState,
			noChange: 'none',
		}, );
		expect( con.get( 'initial', ), ).toEqual( {
			...largeInitial,
			noChange: 'none',
		}, );
	}, );

	it( 'should handle edge case with both initial and state as empty objects', () => {
		const con = createCon( { key: 'value', }, );

		con.mergeHistory( {
			initial: {},
			state: {},
		}, );

		expect( con.get( 'initial', ), ).toEqual( { key: 'value', }, );
		expect( con.get( 'state', ), ).toEqual( { key: 'value', }, );
	}, );

	it( 'should merge when values are overwritten to null or undefined', () => {
		const con = createCon( {
			key1: 'value1' as string | null | undefined,
			key2: 'value2' as string | null | undefined,
		}, );

		con.mergeHistory( {
			initial: { key1: null, },
			state: { key2: undefined, },
		}, );

		expect( con.get( 'initial', ), ).toEqual( {
			key1: null,
			key2: 'value2',
		}, );
		expect( con.get( 'state', ), ).toEqual( {
			key1: 'value1',
			key2: undefined,
		}, );
	}, );

	it( 'should use string path to merge deeply nested array', () => {
		const con = createCon( {
		} as {
			nested: {
				items: Array<string | undefined>
			}
		}, );

		con.mergeHistory( 'state.nested.items', [, 'prop',], );

		expect( con.get( 'state', ), ).toEqual( {
			nested: {
				items: [
					,
					'prop',
				],
			},
		}, );

		con.mergeHistory( 'state.nested.items', [, 'prop1',], );

		expect( con.get( 'state', ), ).toEqual( {
			nested: {
				items: [
					,
					'prop1',
				],
			},
		}, );
	}, );

	it( 'should use string path to merge deeply nested array index', () => {
		const con = createCon( {
		} as {
			nested: {
				items: string[]
			}
		}, );

		con.mergeHistory( 'state.nested.items[2]', 'prop', );

		expect( con.get( 'state', ), ).toEqual( {
			nested: {
				items: [
					undefined,
					undefined,
					'prop',
				],
			},
		}, );
	}, );

	it( 'should use string path to merge deeply nested array value with undefined target', () => {
		const con = createCon( {
		} as {
			nested: {
				items: Array<{
					prop: string
					noProp?: string
				}>
			}
		}, );

		con.mergeHistory( 'state.nested.items[2].prop', 'prop', );

		expect( con.get( 'state', ), ).toEqual( {
			nested: {
				items: [
					undefined,
					undefined,
					{
						prop: 'prop',
					},
				],
			},
		}, );
	}, );

	it( 'should use string path to merge deeply nested array value target', () => {
		const con = createCon( {
			nested: {
				items: [
					{
						prop: 'prop1',
					},
				],
			},
		}, );

		con.mergeHistory( 'state.nested.items[2].prop', 'also prop', );

		expect( con.get( 'state', ), ).toEqual( {
			nested: {
				items: [
					{
						prop: 'prop1',
					},
					undefined,
					{
						prop: 'also prop',
					},
				],
			},
		}, );
	}, );

	it( 'should handle circular references gracefully', () => {
		const circular = {
			value: 1,
		} as {
			value: number
			circular?: {
				value: number
			}
		};
		circular.circular = circular;

		const con = createCon( circular, );
		con.mergeHistory( {
			state: {
				circular,
			},
		}, );
	}, );

	it( 'should handle Date objects', () => {
		const date1 = new Date( '2023-01-01', );
		const date2 = new Date( '2023-12-31', );

		const con = createCon( {
			created: date1,
			nested: { updated: date1, },
		}, );

		con.mergeHistory( {
			state: {
				created: date2,
				nested: { updated: date2, },
			},
		}, );

		expect( con.get( 'state', ).created, ).toEqual( date2, );
		expect( con.get( 'state', ).nested.updated, ).toEqual( date2, );
	}, );

	it( 'should handle RegExp objects', () => {
		const con = createCon( {
			pattern: /test/i,
			nested: { regex: /original/g, },
		}, );

		con.mergeHistory( {
			state: {
				pattern: /updated/i,
				nested: { regex: /new/g, },
			},
		}, );

		expect( con.get( 'state', ).pattern, ).toEqual( /updated/i, );
		expect( con.get( 'state', ).nested.regex, ).toEqual( /new/g, );
	}, );

	it( 'should handle mixed array types', () => {
		const con = createCon( {
			mixed: [
				1 as string | number,
				'two' as string | number,
				{ three: 3, } as { three: number | string },
				[4,],
			],
		}, );

		con.mergeHistory( {
			state: {
				mixed: ['one', 2, { three: 'three', }, [5, 6,],],
			},
		}, );

		expect( con.get( 'state', ).mixed, ).toEqual( ['one', 2, { three: 'three', }, [5, 6,],], );
	}, );

	it( 'should handle deeply nested array mutations', () => {
		const initial = {
			matrix: [
				[
					1,
					2,
				] as Array<number | string>,
				[
					3,
					[
						4,
						5,
					] as Array<number | string>,
				],
				{
					nested: [
						6,
						7,
					] as Array<number | string>,
				},
			],
		};

		const con = createCon( initial, );

		con.mergeHistory( 'state.matrix[1][1][0]', 'updated', );
		con.mergeHistory( 'state.matrix[2].nested[1]', 'changed', );

		expect( con.get( 'state', ).matrix, ).toEqual( [
			[1, 2,],
			[3, ['updated', 5,],],
			{ nested: [6, 'changed',], },
		], );
	}, );

	it( 'should handle merging with non-enumerable properties', () => {
		const initial = {};
		Object.defineProperty( initial, 'hidden', {
			enumerable: false,
			value: 'original',
		}, );

		const con = createCon( initial, );

		const update = {};
		Object.defineProperty( update, 'hidden', {
			enumerable: false,
			value: 'updated',
		}, );

		con.mergeHistory( {
			state: update,
		}, );

		expect( Object.getOwnPropertyDescriptor( con.get( 'state', ), 'hidden', )?.value, ).toBe( 'original', );
	}, );

	it( 'should handle merging of sparse arrays with different lengths', () => {
		const con = createCon( {
			sparse: [1, , 3, , 5,],
		}, );

		con.mergeHistory( {
			state: {
				sparse: [, 2, , 4, , 6, , 8,],
			},
		}, );

		expect( con.get( 'state', ).sparse, ).toEqual( [1, 2, 3, 4, 5, 6, , 8,], );
	}, );

	it( 'should handle merging of arrays with object elements', () => {
		const con = createCon( {
			items: [
				{
					id: 1,
					value: 'one',
				} as {
					id: number
					value?: string
					updated?: boolean
				},
				undefined,
				{
					id: 3,
					value: 'three',
				},
			],
		}, );

		con.mergeHistory( {
			state: {
				items: [
					{
						id: 1,
						updated: true,
					},
					{
						id: 2,
						value: 'two',
					},
					{
						id: 3,
						value: 'updated',
					},
				],
			},
		}, );

		expect( con.get( 'state', ).items, ).toEqual( [
			{ id: 1,
				value: 'one',
				updated: true, },
			{ id: 2,
				value: 'two', },
			{ id: 3,
				value: 'updated', },
		], );
	}, );

	it( 'should handle edge cases with null prototype objects', () => {
		const con = createCon( {
			normal: { a: 1, },
			special: Object.create( null, ),
		}, );

		const nullProto = Object.create( null, );
		nullProto.b = 2;

		con.mergeHistory( {
			state: {
				normal: nullProto,
				special: { c: 3, },
			},
		}, );

		expect( con.get( 'state', ).normal, ).toEqual( { a: 1,
			b: 2, }, );
		expect( con.get( 'state', ).special, ).toEqual( { c: 3, }, );
	}, );
}, );
