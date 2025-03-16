import { create, } from 'mutative';
import { describe, expect, } from 'vitest';
import deepUpdate from '../src/_internal/deepUpdate';

describe( 'deepUpdate', () => {
	describe( 'first level', () => {
		it( 'should set key value in object', () => {
			let target1 = create( {}, draft => deepUpdate( draft, ['s',], 's', ), );

			expect( target1, ).toEqual( { s: 's', }, );

			target1 = create( target1, draft => deepUpdate( draft, ['1',], 1, ), );
			expect( target1, ).toEqual( {
				s: 's',
				1: 1,
			}, );
		}, );

		it( 'should set array index value in array', () => {
			let target1: Array<string | number> = create( [], draft => deepUpdate( draft, [0,], 's', ), );
			expect( target1, ).toEqual( ['s',], );

			target1 = create( target1, draft => deepUpdate( draft, [-1,], '-1', ), );
			expect( target1, ).toEqual( [
				'-1',
			], );

			target1 = create( target1, draft => deepUpdate( draft, [2,], 1, ), );
			expect( target1, ).toEqual( [
				'-1',
				undefined,
				1,
			], );

			target1 = create( target1, draft => deepUpdate( draft, [-2,], '-2', ), );
			expect( target1, ).toEqual( [
				'-1',
				'-2',
				1,
			], );
		}, );

		it( 'should not update invalid path', () => {
			// @ts-expect-error test it shouldn't work
			let target1 = create( { s: 's', }, draft => deepUpdate( draft, [undefined,], 1, ), );
			expect( target1, ).toEqual( { s: 's', }, );

			target1 = create( target1, draft => deepUpdate( draft, [1,], 1, ), );
			expect( target1, ).toEqual( {
				s: 's',
			}, );

			let target2: Array<string | number> = create( ['s',], draft => deepUpdate( draft, ['0',], 1, ), );
			expect( target2, ).toEqual( ['s',], );

			// @ts-expect-error test it shouldn't work
			target2 = create( target2, draft => deepUpdate( draft, [undefined,], 1, ), );
			expect( target2, ).toEqual( ['s',], );
		}, );
	}, );

	describe( 'deeply nested', () => {
		it( 'should set second level key value in object', () => {
			let target1 = create( {}, draft => deepUpdate( draft, ['s', 'ss',], 'value', ), );
			expect( target1, ).toEqual( {
				s: {
					ss: 'value',
				},
			}, );

			target1 = create( target1, draft => deepUpdate( draft, ['0', 1,], '01', ), );
			expect( target1, ).toEqual( {
				s: {
					ss: 'value',
				},
				0: [undefined, '01',],
			}, );

			target1 = create( target1, draft => deepUpdate( draft, ['0', 2, 1, 's',], 's021s', ), );
			expect( target1, ).toEqual( {
				s: {
					ss: 'value',
				},
				0: [undefined, '01', [undefined, { s: 's021s', },],],
			}, );
		}, );

		it( 'should not update second level invalid path', () => {
			let target1 = create( { s: 's', }, ( draft, ) => {
				deepUpdate( draft, ['s', 'o',], 1, );
			}, );
			expect( target1, ).toEqual( { s: 's', }, );

			target1 = create( target1, ( draft, ) => {
				deepUpdate( draft, [0, 1,], '01', );
			}, );
			expect( target1, ).toEqual( { s: 's', }, );

			target1 = create( target1, ( draft, ) => {
			// @ts-expect-error test it shouldn't work
				deepUpdate( draft, [undefined, undefined,], null, );
			}, );
			expect( target1, ).toEqual( { s: 's', }, );

			target1 = create( target1, ( draft, ) => {
			// @ts-expect-error test it shouldn't work
				deepUpdate( draft, [undefined, 1,], null, );
			}, );
			expect( target1, ).toEqual( { s: 's', }, );

			target1 = create( target1, ( draft, ) => {
			// @ts-expect-error test it shouldn't work
				deepUpdate( draft, ['s', undefined,], null, );
			}, );
			expect( target1, ).toEqual( { s: 's', }, );

			let target2 = create( ['s',] as Array<string | number>, ( draft, ) => {
				deepUpdate( draft, [0, 2,], 1, );
			}, );
			expect( target2, ).toEqual( ['s',], );

			target2 = create( target2, ( draft, ) => {
			// @ts-expect-error test it shouldn't work
				deepUpdate( draft, [undefined, undefined,], null, );
			}, );
			expect( target2, ).toEqual( ['s',], );

			target2 = create( target2, ( draft, ) => {
				deepUpdate( draft, ['s', 1,], null, );
			}, );
			expect( target2, ).toEqual( ['s',], );
		}, );
	}, );

	describe( 'edge cases', () => {
		it( 'should handle empty path array', () => {
			const target = create( { a: 1, }, ( draft, ) => {
				deepUpdate( draft, [], 'value', );
			}, );
			expect( target, ).toEqual( { a: 1, }, );
		}, );

		it( 'should handle null values', () => {
			const target = create( { a: { b: 1, }, }, ( draft, ) => {
				deepUpdate( draft, ['a', 'b',], null, );
			}, );
			expect( target, ).toEqual( { a: { b: null, }, }, );
		}, );

		it( 'should handle mixed array and object paths', () => {
			const target = create( { users: [{ name: 'John', },], }, ( draft, ) => {
				deepUpdate( draft, ['users', 0, 'name',], 'Jane', );
			}, );
			expect( target, ).toEqual( { users: [{ name: 'Jane', },], }, );
		}, );

		it( 'should create nested structures as needed', () => {
			const target = create( {}, ( draft, ) => {
				deepUpdate( draft, ['a', 'b', 'c', 'd',], 'value', );
			}, );
			expect( target, ).toEqual( {
				a: {
					b: {
						c: {
							d: 'value',
						},
					},
				},
			}, );
		}, );

		it( 'should handle array paths with negative indices', () => {
			const target = create( { items: ['a', 'b', 'c',], }, ( draft, ) => {
				deepUpdate( draft, ['items', -2,], 'x', );
			}, );
			expect( target, ).toEqual( { items: ['a', 'x', 'c',], }, );
		}, );

		it( 'should preserve existing object properties', () => {
			const target = create( {
				existing: 'value',
				nested: { keep: true, },
			}, ( draft, ) => {
				deepUpdate( draft, ['nested', 'new',], 'added', );
			}, );
			expect( target, ).toEqual( {
				existing: 'value',
				nested: {
					keep: true,
					'new': 'added',
				},
			}, );
		}, );
	}, );
}, );
