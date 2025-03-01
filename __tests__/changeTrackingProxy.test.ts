import { describe, it, expect, } from 'vitest';
import createDraftChangeTrackingProxy from '../src/_internal/createChangeTrackingProxy';

describe( 'createDraftChangeTrackingProxy', () => {
	it( 'should track top-level changes', () => {
		const initial = {
			name: 'John',
			age: 30,
		};
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.name = 'Jane';
		proxy.age = 31;

		expect( changes, ).toEqual( {
			name: 'Jane',
			age: 31,
		}, );
		expect( proxy, ).toEqual( {
			name: 'Jane',
			age: 31,
		}, );
	}, );

	it( 'should not track when value remains the same', () => {
		const initial = { name: 'John',
			age: 30, };
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.name = 'John'; // Same value
		proxy.age = 30; // Same value

		expect( changes, ).toEqual( {}, );
		expect( proxy, ).toEqual( initial, );
	}, );

	it( 'should handle nested objects', () => {
		const initial = {
			user: {
				name: 'John',
				details: {
					age: 30,
				},
			},
		};
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.user.name = 'Jane';
		proxy.user.details.age = 31;

		expect( changes, ).toEqual( {
			user: {
				name: 'Jane',
				details: {
					age: 31,
				},
			},
		}, );
		expect( proxy.user.name, ).toBe( 'Jane', );
		expect( proxy.user.details.age, ).toBe( 31, );
	}, );

	it( 'should handle arrays', () => {
		const initial = { items: [1, 2, 3, 4,], };
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.items[ 1 ] = 10;
		proxy.items[ 3 ] = 20;

		expect( changes, ).toEqual( {
			items: [undefined, 10, undefined, 20,],
		}, );
		expect( proxy.items, ).toEqual( [1, 10, 3, 20,], );
	}, );

	it( 'should handle null values', () => {
		const initial = { user: { name: 'John', } as object | null, };
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.user = null;

		expect( changes, ).toEqual( {
			user: null,
		}, );
		expect( proxy.user, ).toBeNull();
	}, );

	it( 'should handle undefined values', () => {
		const initial = { user: { name: 'John', } as object | undefined, };
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.user = undefined;

		expect( changes, ).toEqual( {
			user: undefined,
		}, );
		expect( proxy.user, ).toBeUndefined();
	}, );

	it( 'should handle adding new properties', () => {
		const initial: {
			name: string
			age?: number
			city?: string
		} = { name: 'John', };
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.age = 30;
		proxy.city = 'New York';

		expect( changes, ).toEqual( {
			age: 30,
			city: 'New York',
		}, );
		expect( proxy, ).toEqual( {
			name: 'John',
			age: 30,
			city: 'New York',
		}, );
	}, );

	it( 'should track multiple changes to the same property', () => {
		const initial = { count: 0, };
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.count = 1;
		proxy.count = 2;
		proxy.count = 3;

		expect( changes, ).toEqual( {
			count: 3,
		}, );
		expect( proxy.count, ).toBe( 3, );
	}, );

	it( 'should handle complex nested structures', () => {
		const initial = {
			users: [
				{
					id: 1,
					details: {
						name: 'John',
						age: 30,
					},
				},
				{
					id: 2,
					details: {
						name: 'Jane',
						age: 25,
					},
				},
			],
		};
		const [proxy, changes,] = createDraftChangeTrackingProxy( initial, );

		proxy.users[ 0 ].details.name = 'Johnny';
		proxy.users[ 1 ].details.age = 26;

		expect( changes, ).toEqual( {
			users: [
				{
					details: {
						name: 'Johnny',
					},
				},
				{
					details: {
						age: 26,
					},
				},
			],
		}, );
		expect( proxy.users[ 0 ].details.name, ).toBe( 'Johnny', );
		expect( proxy.users[ 1 ].details.age, ).toBe( 26, );
	}, );

	it( 'should preserve non-object values', () => {
		const initial = {
			string: 'hello',
			number: 42,
			'boolean': true,
			'null': null,
			undefined,
		};
		const [proxy,] = createDraftChangeTrackingProxy( initial, );

		expect( proxy.string, ).toBe( 'hello', );
		expect( proxy.number, ).toBe( 42, );
		expect( proxy.boolean, ).toBe( true, );
		expect( proxy.null, ).toBeNull();
		expect( proxy.undefined, ).toBeUndefined();
	}, );
}, );
