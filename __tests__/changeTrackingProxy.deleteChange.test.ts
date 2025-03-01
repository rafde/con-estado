import { describe, expect, it, } from 'vitest';
import { deleteChange, } from '../src/_internal/createChangeTrackingProxy';

describe( 'deleteChange', () => {
	it( 'should return false if the property does not exist in changes', () => {
		const propPath = ['a', 'b', 'c',];
		const changes = { a: { x: { y: 42, }, }, };

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( false, );
	}, );

	it( 'should delete the property and return true if it exists in changes', () => {
		const propPath = ['a', 'b', 'c',];
		const changes = { a: { b: { c: 42, }, }, };

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( true, );
		expect( changes, ).toEqual( { a: { b: {}, }, }, );
	}, );

	it( 'should return true even if the deeper path is empty after deletion', () => {
		const propPath = ['a', 'b',];
		const changes = { a: { b: {}, }, };

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( true, );
		expect( changes, ).toEqual( { a: {}, }, );
	}, );

	it( 'should handle deeply nested paths correctly', () => {
		const propPath = ['a', 'b', 'c', 'd',];
		const changes = { a: { b: { c: { d: 42, }, }, }, };

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( true, );
		expect( changes, ).toEqual( { a: { b: { c: {}, }, }, }, );
	}, );

	it( 'should handle deeply array paths correctly', () => {
		const propPath = ['a', 'b', 'c', 1,];
		const changes = { a: { b: { c: [1, 2, 4,], }, }, };

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( true, );
		expect( changes, ).toEqual( { a: { b: { c: [1, undefined, 4,], }, }, }, );
	}, );

	it( 'should not modify the target object', () => {
		const propPath = ['a', 'b',];
		const changes = { a: { b: 123, }, };

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( true, );
	}, );

	it( 'should return false if the changes object is empty', () => {
		const propPath = ['a',];
		const changes = {};

		const result = deleteChange( propPath, changes, );
		expect( result, ).toBe( false, );
	}, );
}, );
