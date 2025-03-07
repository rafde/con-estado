import parseSegments from '../src/_internal/parseSegments';
import { describe, it, expect, } from 'vitest';

describe( 'parseSegments', () => {
	it( 'should handle dot segments', () => {
		expect( parseSegments( 'a', ), ).toEqual( ['a',], );
		expect( parseSegments( 'a.b', ), ).toEqual( ['a', 'b',], );
		expect( parseSegments( 'a.b.c', ), ).toEqual( ['a', 'b', 'c',], );
		expect( parseSegments( '1', ), ).toEqual( ['1',], );
		expect( parseSegments( '1.b', ), ).toEqual( ['1', 'b',], );
		expect( parseSegments( '1.b.2', ), ).toEqual( ['1', 'b', '2',], );
		expect( parseSegments( '1.b.2.c', ), ).toEqual( ['1', 'b', '2', 'c',], );
	}, );

	it( 'should handle escaped dot segments', () => {
		expect( parseSegments( '1.b.2\\.c', ), ).toEqual( ['1', 'b', '2.c',], );
		expect( parseSegments( '1.b\\.2\\.c', ), ).toEqual( ['1', 'b.2.c',], );
		expect( parseSegments( '1\\.b\\.2\\.c', ), ).toEqual( ['1.b.2.c',], );
	}, );

	it( 'should handle array indices segments', () => {
		expect( parseSegments( '[0]', ), ).toEqual( [0,], );
		expect( parseSegments( '[0][-1]', ), ).toEqual( [0, -1,], );
		expect( parseSegments( '[0][1][2]', ), ).toEqual( [0, 1, 2,], );
	}, );

	it( 'should handle escaped array indices segments', () => {
		expect( parseSegments( '\\[0][1][2]', ), ).toEqual( ['[0]', 1, 2,], );
		expect( parseSegments( '\\[0]\\[1][2]', ), ).toEqual( ['[0][1]', 2,], );
		expect( parseSegments( '\\[0]\\[1]\\[2]', ), ).toEqual( ['[0][1][2]',], );
	}, );

	it( 'should handle array indices segments with object key', () => {
		expect( parseSegments( 'a[0]', ), ).toEqual( ['a', 0,], );
		expect( parseSegments( 'a[0][-1]', ), ).toEqual( ['a', 0, -1,], );
		expect( parseSegments( 'a[0][1][2]', ), ).toEqual( ['a', 0, 1, 2,], );
	}, );

	it( 'should handle escaped array indices segments with object key', () => {
		expect( parseSegments( 'a\\[0][1][2]', ), ).toEqual( ['a[0]', 1, 2,], );
		expect( parseSegments( 'a\\[0]\\[1][2]', ), ).toEqual( ['a[0][1]', 2,], );
		expect( parseSegments( 'a\\[0]\\[1]\\[2]', ), ).toEqual( ['a[0][1][2]',], );

		expect( parseSegments( 'a\\[0]a[1][2]', ), ).toEqual( ['a[0]a', 1, 2,], );
		expect( parseSegments( 'a\\[0]a\\[1][2]', ), ).toEqual( ['a[0]a[1]', 2,], );
		expect( parseSegments( 'a\\[0]a\\[1][2]', ), ).toEqual( ['a[0]a[1]', 2,], );
		expect( parseSegments( 'a\\[0]a\\.b\\[1]\\[2]', ), ).toEqual( ['a[0]a.b[1][2]',], );
		expect( parseSegments( 'a\\[0]a\\.b\\[1][2]', ), ).toEqual( ['a[0]a.b[1]', 2,], );
	}, );

	it( 'should handle mixed named dot and array indices segments', () => {
		expect( parseSegments( 'a[0].b[1].c[2].d[3]', ), )
			.toEqual( ['a', 0, 'b', 1, 'c', 2, 'd', 3,], );
		expect( parseSegments( 'a[0].b[1].c[2].d[3][4]', ), )
			.toEqual( ['a', 0, 'b', 1, 'c', 2, 'd', 3, 4,], );
		expect( parseSegments( 'a[0].b[1].c[2][5].d[3][4]', ), )
			.toEqual( ['a', 0, 'b', 1, 'c', 2, 5, 'd', 3, 4,], );
		expect( parseSegments( 'a[0].b[1][6].c[2][5].d[3][4]', ), )
			.toEqual( ['a', 0, 'b', 1, 6, 'c', 2, 5, 'd', 3, 4,], );
		expect( parseSegments( 'a[0][7].b[1][6].c[2][5].d[3][4]', ), )
			.toEqual( ['a', 0, 7, 'b', 1, 6, 'c', 2, 5, 'd', 3, 4,], );
	}, );

	it( 'should handle mixed un-named dot and array indices segments', () => {
		expect( parseSegments( 'a[0].b[1].c[2].[3]', ), )
			.toEqual( ['a', 0, 'b', 1, 'c', 2, '', 3,], );
		expect( parseSegments( 'a[0].b[1].[2].[3]', ), )
			.toEqual( ['a', 0, 'b', 1, '', 2, '', 3,], );
		expect( parseSegments( 'a[0].[1].[2].[3]', ), )
			.toEqual( ['a', 0, '', 1, '', 2, '', 3,], );
		expect( parseSegments( '[0].[1].[2].[3]', ), )
			.toEqual( [0, '', 1, '', 2, '', 3,], );
	}, );

	describe( 'basic path parsing', () => {
		it( 'should handle dot in bracket', () => {
			expect( parseSegments( 'a[1.5]', ), ).toEqual( [], );
		}, );

		it( 'should handle unclosed bracket', () => {
			expect( parseSegments( 'a[0.b', ), ).toEqual( [], );
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

		it( 'should handle mixed escaped characters', () => {
			expect( parseSegments( 'a\\.b[0].c\\[1]', ), ).toEqual( ['a.b', 0, 'c[1]',], );
			expect( parseSegments( 'a\\.b[0\\.1].c\\[1]', ), ).toEqual( [], );
			expect( parseSegments( '[asdf].a\\.b[0\\.1].c\\[1]', ), ).toEqual( [], );
		}, );
	}, );

	describe( 'edge cases', () => {
		it( 'should handle escaped backslash', () => {
			expect( parseSegments( 'a\\\\b', ), ).toEqual( ['a\\\\b',], );
		}, );

		it( 'should parse empty bracket', () => {
			expect( parseSegments( '[]', ), ).toEqual( [], );
			expect( parseSegments( '[][]', ), ).toEqual( [], );
		}, );

		it( 'should parse string with bracket', () => {
			expect( parseSegments( '[a]', ), ).toEqual( [], );
			expect( parseSegments( 'a[a]', ), ).toEqual( [], );
			expect( parseSegments( 'a[a]a', ), ).toEqual( [], );
		}, );

		it( 'should handle non-array bracket', () => {
			expect( parseSegments( 'a[-1]', ), ).toEqual( ['a', -1,], );
			expect( parseSegments( 'a[-1][0]', ), ).toEqual( ['a', -1, 0,], );
			expect( parseSegments( 'a[0][-1]', ), ).toEqual( ['a', 0, -1,], );
			expect( parseSegments( 'a[0][-1].a', ), ).toEqual( ['a', 0, -1, 'a',], );
			expect( parseSegments( 'a[0][-1][3]', ), ).toEqual( ['a', 0, -1, 3,], );
			expect( parseSegments( 'a[0][-1][3][4]', ), ).toEqual( ['a', 0, -1, 3, 4,], );
			expect( parseSegments( 'a[0][-1][3][-2]', ), ).toEqual( ['a', 0, -1, 3, -2,], );
			expect( parseSegments( 'a[0][-1][3][-2][9]', ), ).toEqual( ['a', 0, -1, 3, -2, 9,], );
			expect( parseSegments( 'a[0][b][3][-2][9]', ), ).toEqual( [], );
		}, );

		it( 'should handle a[b]', () => {
			expect( parseSegments( 'a[b]', ), ).toEqual( [], );
		}, );

		it( 'should handle [] as key', () => {
			expect( parseSegments( 'a.[].b', ), ).toEqual( [], );
		}, );

		it( 'should handle a[]', () => {
			expect( parseSegments( 'a[].b', ), ).toEqual( [], );
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

			expect( parseSegments( '[1][3].[4]', ), ).toEqual( [1, 3, '', 4,], );
		}, );
	}, );

	describe( 'mixed bracket scenarios', () => {
		it( 'should handle mixed array indices and string brackets', () => {
			expect( parseSegments( 'users[0][name][1]', ), ).toEqual( [], );
			expect( parseSegments( 'data[0][key].value[test]', ), ).toEqual( [], );
		}, );

		it( 'should handle nested brackets with dots', () => {
			expect( parseSegments( 'a[b.c][0].d', ), ).toEqual( [], );
			expect( parseSegments( 'x[y.z.w][1]', ), ).toEqual( [], );
		}, );

		it( 'should handle partially valid bracket notations', () => {
			expect( parseSegments( 'items[0][1.2][3]', ), ).toEqual( [], );
			expect( parseSegments( 'data[0][.][2]', ), ).toEqual( [], );
		}, );

		it( 'should handle complex mixed notations', () => {
			expect( parseSegments( 'users[0].contacts[primary][2].address', ), )
				.toEqual( [], );
			expect( parseSegments( 'data[0][key.sub][2].value', ), )
				.toEqual( [], );
		}, );

		it( 'should handle brackets with special characters', () => {
			expect( parseSegments( 'list[*][0].item', ), ).toEqual( [], );
			expect( parseSegments( 'obj[$key][0]', ), ).toEqual( [], );
		}, );

		it( 'should handle multiple consecutive brackets with mixed content', () => {
			expect( parseSegments( 'data[0][test][1][key]', ), ).toEqual( [], );
			expect( parseSegments( 'items[][test][][][0]', ), ).toEqual( [], );
			expect( parseSegments( 'items[[[[1]]]].a[]', ), ).toEqual( [], );
		}, );
	}, );
}, );
