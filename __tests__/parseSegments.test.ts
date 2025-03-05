import parseSegments from '../src/_internal/parseSegments';
import { describe, it, expect, } from 'vitest';

describe( 'parseSegments', () => {
	describe( 'basic path parsing', () => {
		it( 'should handle single segment', () => {
			expect( parseSegments( 'a', ), ).toEqual( ['a',], );
		}, );

		it( 'should parse simple dot notation', () => {
			expect( parseSegments( 'a.b.c', ), ).toEqual( ['a', 'b', 'c',], );
		}, );

		it( 'should parse simple dot notation with a number inside', () => {
			expect( parseSegments( 'a.1.c', ), ).toEqual( ['a', '1', 'c',], );
			expect( parseSegments( '1.b.d', ), ).toEqual( ['1', 'b', 'd',], );
		}, );

		it( 'should parse array indices', () => {
			expect( parseSegments( 'a[0].b[1]', ), ).toEqual( ['a', 0, 'b', 1,], );
		}, );

		it( 'should convert valid array indices to numbers', () => {
			expect( parseSegments( '[0][1][2]', ), ).toEqual( [0, 1, 2,], );
		}, );

		it( 'should handle deep paths', () => {
			expect( parseSegments( 'a[0].b[1].c[2].d[3]', ), )
				.toEqual( ['a', 0, 'b', 1, 'c', 2, 'd', 3,], );
		}, );

		it( 'should parse mixed dot and bracket notation', () => {
			expect( parseSegments( 'users[0].addresses[1].street', ), )
				.toEqual( ['users', 0, 'addresses', 1, 'street',], );
		}, );

		it( 'should handle dot in bracket', () => {
			expect( parseSegments( 'a[1.5]', ), ).toEqual( ['a[1', '5]',], );
		}, );

		it( 'should handle unclosed bracket', () => {
			expect( parseSegments( 'a[0.b', ), ).toEqual( ['a[0', 'b',], );
		}, );
	}, );

	describe( 'escaped characters', () => {
		it( 'should handle escaped dots', () => {
			expect( parseSegments( 'a\\.b.c', ), ).toEqual( ['a.b', 'c',], );
			expect( parseSegments( 'x\\.y\\.z', ), ).toEqual( ['x.y.z',], );
		}, );

		it( 'should handle escaped brackets', () => {
			expect( parseSegments( 'a\\[0].b', ), ).toEqual( ['a[0]', 'b',], );
			expect( parseSegments( 'x\\[1\\].y', ), ).toEqual( ['x[1\\]', 'y',], );
			expect( parseSegments( 'x\\[1].y', ), ).toEqual( ['x[1]', 'y',], );
		}, );

		it( 'should handle escaped backslash', () => {
			expect( parseSegments( 'a\\\\b', ), ).toEqual( ['a\\\\b',], );
		}, );

		it( 'should handle mixed escaped characters', () => {
			expect( parseSegments( 'a\\.b[0].c\\[1]', ), ).toEqual( ['a.b', 0, 'c[1]',], );
			expect( parseSegments( 'a\\.b[0\\.1].c\\[1]', ), ).toEqual( ['a.b[0.1]', 'c[1]',], );
			expect( parseSegments( '[asdf].a\\.b[0\\.1].c\\[1]', ), ).toEqual( ['[asdf]', 'a.b[0.1]', 'c[1]',], );
		}, );
	}, );

	describe( 'edge cases', () => {
		it( 'should parse empty bracket', () => {
			expect( parseSegments( '[]', ), ).toEqual( ['[]',], );
			expect( parseSegments( '[][]', ), ).toEqual( ['[][]',], );
		}, );

		it( 'should parse string with bracket', () => {
			expect( parseSegments( '[a]', ), ).toEqual( ['[a]',], );
			expect( parseSegments( 'a[a]', ), ).toEqual( ['a[a]',], );
			expect( parseSegments( 'a[a]a', ), ).toEqual( ['a[a]a',], );
		}, );

		it( 'should handle non-array bracket', () => {
			expect( parseSegments( 'a[-1]', ), ).toEqual( ['a[-1]',], );
			expect( parseSegments( 'a[-1][0]', ), ).toEqual( ['a[-1]', 0,], );
			expect( parseSegments( 'a[0][-1]', ), ).toEqual( ['a[0][-1]',], );
			expect( parseSegments( 'a[0][-1].a', ), ).toEqual( ['a[0][-1]', 'a',], );
			expect( parseSegments( 'a[0][-1][3]', ), ).toEqual( ['a[0][-1]', 3,], );
			expect( parseSegments( 'a[0][-1][3][4]', ), ).toEqual( ['a[0][-1]', 3, 4,], );
			expect( parseSegments( 'a[0][-1][3][-2]', ), ).toEqual( ['a[0][-1][3][-2]',], );
			expect( parseSegments( 'a[0][-1][3][-2][9]', ), ).toEqual( ['a[0][-1][3][-2]', 9,], );
			expect( parseSegments( 'a[0][b][3][-2][9]', ), ).toEqual( ['a[0][b][3][-2]', 9,], );
		}, );

		it( 'should handle a[b]', () => {
			expect( parseSegments( 'a[b]', ), ).toEqual( ['a[b]',], );
		}, );

		it( 'should handle [] as key', () => {
			expect( parseSegments( 'a.[].b', ), ).toEqual( ['a', '[]', 'b',], );
		}, );

		it( 'should handle a[]', () => {
			expect( parseSegments( 'a[].b', ), ).toEqual( ['a[]', 'b',], );
		}, );

		it( 'should handle consecutive dots', () => {
			expect( parseSegments( 'a..b', ), ).toEqual( ['a', '', 'b',], );
		}, );

		it( 'should handle empty string', () => {
			expect( parseSegments( '', ), ).toEqual( [], );
		}, );

		it( 'should handle dot', () => {
			expect( parseSegments( '.', ), ).toEqual( ['', '',], );
		}, );
	}, );

	describe( 'complex patterns', () => {
		it( 'should handle mixed escaped characters and array indices', () => {
			expect( parseSegments( 'a\\.b[0].c\\[1][2]', ), )
				.toEqual( ['a.b', 0, 'c[1]', 2,], );
		}, );

		it( 'should handle paths with special characters', () => {
			expect( parseSegments( 'special\\@path[0].with\\.dots', ), )
				.toEqual( ['special\\@path', 0, 'with.dots',], );
		}, );

		it( 'should handle deeply nested escaped paths', () => {
			expect( parseSegments( 'a\\[0\\][1].b\\.c.d', ), )
				.toEqual( ['a[0\\]', 1, 'b.c', 'd',], );

			expect( parseSegments( '[1][3].[4]', ), ).toEqual( [1, 3, '[4]',], );
		}, );
	}, );

	describe( 'mixed bracket scenarios', () => {
		it( 'should handle mixed array indices and string brackets', () => {
			expect( parseSegments( 'users[0][name][1]', ), ).toEqual( ['users[0][name][1]',], );
			expect( parseSegments( 'data[0][key].value[test]', ), ).toEqual( ['data[0][key]', 'value[test]',], );
		}, );

		it( 'should handle nested brackets with dots', () => {
			expect( parseSegments( 'a[b.c][0].d', ), ).toEqual( ['a[b', 'c]', 0, 'd',], );
			expect( parseSegments( 'x[y.z.w][1]', ), ).toEqual( ['x[y', 'z', 'w]', 1,], );
		}, );

		it( 'should handle partially valid bracket notations', () => {
			expect( parseSegments( 'items[0][1.2][3]', ), ).toEqual( ['items[0][1', '2]', 3,], );
			expect( parseSegments( 'data[0][.][2]', ), ).toEqual( ['data[0][', ']', 2,], );
		}, );

		it( 'should handle complex mixed notations', () => {
			expect( parseSegments( 'users[0].contacts[primary][2].address', ), )
				.toEqual( ['users', 0, 'contacts[primary]', 2, 'address',], );
			expect( parseSegments( 'data[0][key.sub][2].value', ), )
				.toEqual( ['data[0][key', 'sub]', 2, 'value',], );
		}, );

		it( 'should handle brackets with special characters', () => {
			expect( parseSegments( 'list[*][0].item', ), ).toEqual( ['list[*]', 0, 'item',], );
			expect( parseSegments( 'obj[$key][0]', ), ).toEqual( ['obj[$key]', 0,], );
		}, );

		it( 'should handle multiple consecutive brackets with mixed content', () => {
			expect( parseSegments( 'data[0][test][1][key]', ), ).toEqual( ['data[0][test][1][key]',], );
			expect( parseSegments( 'items[][test][][][0]', ), ).toEqual( ['items[][test][][]', 0,], );
			expect( parseSegments( 'items[[[[1]]]].a[]', ), ).toEqual( ['items[[[[1]]]]', 'a[]',], );
		}, );
	}, );
}, );
