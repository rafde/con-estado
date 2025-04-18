import { describe, it, expect, } from 'vitest';
import deepAccess from '../src/_internal/deepAccess';

describe( 'deepAccess', () => {
	describe( 'basic functionality', () => {
		it( 'should access nested properties in an object', () => {
			const obj = { a: { b: { c: 'value', }, }, };
			expect( deepAccess( obj, ['a', 'b', 'c',], ), ).toBe( 'value', );
		}, );

		it( 'should access array elements', () => {
			const arr = [1, 2, [3, 4,],];
			expect( deepAccess( arr, [2, 0,], ), ).toBe( 3, );
		}, );

		it( 'should handle mixed object and array paths', () => {
			const mixed = { users: [{ name: 'John', }, { name: 'Jane', },], };
			expect( deepAccess( mixed, ['users', 1, 'name',], ), ).toBe( 'Jane', );
		}, );
	}, );

	describe( 'error handling and edge cases', () => {
		it( 'should return undefined for null or undefined state', () => {
			expect( deepAccess( null, ['a', 'b',], ), ).toBeUndefined();
			expect( deepAccess( undefined, ['a', 'b',], ), ).toBeUndefined();
		}, );

		it( 'should return undefined when accessing a property on a null or undefined value', () => {
			const obj = { a: null,
				b: undefined, };
			expect( deepAccess( obj, ['a', 'prop',], ), ).toBe( null, );
			expect( deepAccess( obj, ['b', 'prop',], ), ).toBeUndefined();
		}, );

		it( 'should return undefined when accessing an array with non-number or non-integer path', () => {
			const arr = [1, 2, 3,];
			expect( deepAccess( arr, ['0',], ), ).toBeUndefined();
			// Testing with float instead of integer
			expect( deepAccess( arr, [1.5,], ), ).toBeUndefined();
		}, );

		it( 'should return undefined when key is invalid', () => {
			const obj = { a: {}, };
			// @ts-expect-error - Testing with invalid key type
			expect( deepAccess( obj, ['a', true,], ), ).toBeUndefined();
			// @ts-expect-error - Testing with invalid key type
			expect( deepAccess( obj, ['a', {},], ), ).toBeUndefined();
		}, );
	}, );

	describe( 'negative array indices', () => {
		it( 'should handle negative array indices', () => {
			const arr = [1, 2, 3, 4, 5,];
			expect( deepAccess( arr, [-1,], ), ).toBe( 5, );
			expect( deepAccess( arr, [-2,], ), ).toBe( 4, );
		}, );

		it( 'should throw error when negative index is out of bounds', () => {
			const arr = [1, 2, 3,];
			expect( () => {
				deepAccess( arr, [-4,], () => 'new value', );
			}, ).toThrowError( /out of bounds for array length/, );
		}, );
	}, );

	describe( 'updater function', () => {
		it( 'should update a value using the updater function', () => {
			const obj = { a: { b: 1, }, };
			const result = deepAccess( obj, ['a', 'b',], oldValue => ( oldValue as number ) + 1, );
			expect( result, ).toBe( 2, );
			expect( obj.a.b, ).toBe( 2, );
		}, );

		it( 'should not update if the new value is the same as the old value', () => {
			const obj = { a: { b: 1, }, };
			const result = deepAccess( obj, ['a', 'b',], oldValue => oldValue, );
			expect( result, ).toBeUndefined();
			expect( obj.a.b, ).toBe( 1, );
		}, );

		it( 'should create intermediate objects if they do not exist', () => {
			const obj = {} as { a?: { b?: { c: number } } };
			deepAccess( obj, ['a', 'b', 'c',], () => 42, );
			expect( obj.a?.b?.c, ).toBe( 42, );
		}, );

		it( 'should create intermediate arrays if the next path segment is a number', () => {
			const obj = {} as { a?: { b?: number[] } };
			deepAccess( obj, ['a', 'b', 0,], () => 42, );
			expect( obj.a?.b?.[ 0 ], ).toBe( 42, );
		}, );

		it( 'should throw error when trying to update a non-object/array', () => {
			const obj = { a: 1, };
			expect( () => {
				deepAccess( obj, ['a', 'b',], () => 'value', );
			}, ).toThrowError( /invalid target type/, );
		}, );

		it( 'should throw error when key is invalid with updater', () => {
			const obj = { a: {}, };
			expect( () => {
				// @ts-expect-error - Testing with invalid key type
				deepAccess( obj, ['a', true,], () => 'value', );
			}, ).toThrowError( /Invalid target key/, );
		}, );
	}, );

	describe( 'complex scenarios', () => {
		it( 'should handle deeply nested paths with mixed types', () => {
			const complex = {
				users: [
					{
						id: 1,
						posts: [
							{ id: 1,
								comments: [{ text: 'first comment', },], },
						],
					},
				],
			};

			expect( deepAccess( complex, ['users', 0, 'posts', 0, 'comments', 0, 'text',], ), ).toBe( 'first comment', );

			deepAccess( complex, ['users', 0, 'posts', 0, 'comments', 0, 'text',], () => 'updated comment', );
			expect( complex.users[ 0 ].posts[ 0 ].comments[ 0 ].text, ).toBe( 'updated comment', );
		}, );

		it( 'should handle paths with special characters when accessed directly', () => {
			const obj = { 'a.b': { 'c[0]': 'value', }, };
			expect( deepAccess( obj, ['a.b', 'c[0]',], ), ).toBe( 'value', );
		}, );
	}, );
}, );
