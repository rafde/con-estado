import { describe, it, expect, } from 'vitest';
import { applyChange, } from '../src/_internal/createChangeTrackingProxy';

describe( 'applyChange', () => {
	it( 'should set a top-level property value in changes', () => {
		const target = {
			name: 'John',
			age: 30,
		};
		const changes: Record<string, unknown> = {};

		const didItChangeName = applyChange( ['name',], target, changes, 'Jane', );
		const didItChangeAge = applyChange( ['age',], target, changes, 35, );

		expect( changes, ).toEqual( {
			name: 'Jane',
			age: 35,
		}, );
		expect( didItChangeName, ).toBe( true, );
		expect( didItChangeAge, ).toBe( true, );
	}, );

	it( 'should create nested objects in changes if they don’t exist', () => {
		const target = {
			user: {
				details: {
					name: 'John',
					age: 30,
				},
			},
		};
		const changes: Record<string, unknown> = {};

		const didItChangeName = applyChange( ['user', 'details', 'name',], target, changes, 'Jane', );
		const didItChangeAge = applyChange( ['user', 'details', 'age',], target, changes, 35, );

		expect( changes, ).toEqual( {
			user: {
				details: {
					name: 'Jane',
					age: 35,
				},
			},
		}, );
		expect( didItChangeName, ).toBe( true, );
		expect( didItChangeAge, ).toBe( true, );
	}, );

	it( 'should handle arrays as nested structures', () => {
		const target = {
			items: [1, 2, 3, 4,],
		};
		const changes: Record<string, unknown> = {};

		const didItChangeItem1 = applyChange( ['items', 1,], target, changes, 10, );
		const didItChangeItem3 = applyChange( ['items', 3,], target, changes, 20, );

		expect( changes, ).toEqual( {
			items: [undefined, 10, undefined, 20,],
		}, );
		expect( didItChangeItem1, ).toBe( true, );
		expect( didItChangeItem3, ).toBe( true, );
	}, );

	it( 'should create intermediate nested arrays if they don’t exist', () => {
		const target = {
			items: [[1, 2,], [3, 4,],],
		};
		const changes: Record<string, unknown> = {};

		const didItChangeItem0_1 = applyChange( ['items', 0, 1,], target, changes, 99, );

		expect( changes, ).toEqual( {
			items: [[undefined, 99,],],
		}, );
		expect( didItChangeItem0_1, ).toBe( true, );
	}, );

	it( 'should add new properties to changes for non-existent keys', () => {
		const target = {
			user: {
				details: {
					age: 30,
				},
			},
		};
		const changes: Record<string, unknown> = {};

		const didItChange = applyChange( ['user', 'details', 'name',], target, changes, 'Jane', );

		expect( changes, ).toEqual( {
			user: {
				details: {
					name: 'Jane',
				},
			},
		}, );
		expect( didItChange, ).toBe( true, );
	}, );

	it( 'should not overwrite existing values in changes', () => {
		const target = {
			user: {
				details: {
					name: 'John',
					age: 30,
				},
			},
		};
		const changes: Record<string, unknown> = {
			user: {
				details: {
					name: 'Existing Name',
				},
			},
		};

		const didItChange = applyChange( ['user', 'details', 'age',], target, changes, 35, );

		expect( changes, ).toEqual( {
			user: {
				details: {
					name: 'Existing Name',
					age: 35,
				},
			},
		}, );
		expect( didItChange, ).toBe( true, );
	}, );

	it( 'should handle setting a top-level array', () => {
		const target = {
			items: [1, 2, 3,],
		};
		const changes: Record<string, unknown> = {};

		const didItChange = applyChange( ['items',], target, changes, [9, 8, 7,], );

		expect( changes, ).toEqual( {
			items: [9, 8, 7,],
		}, );
		expect( didItChange, ).toBe( true, );
	}, );

	it( 'should handle empty paths gracefully', () => {
		const target = { name: 'John', };
		const changes: Record<string, unknown> = {};

		const didItChange = applyChange( [], target, changes, 'New Value', ); // No change should occur

		expect( changes, ).toStrictEqual( {}, );
		expect( didItChange, ).toBe( false, );
	}, );

	it( 'should correctly initialize changes when setting a deep value', () => {
		const target = {
			user: {
				preferences: {
					notifications: {
						email: true,
					},
				},
			},
		};
		const changes: Record<string, unknown> = {};

		const didItChange = applyChange( ['user', 'preferences', 'notifications', 'email',], target, changes, false, );

		expect( changes, ).toEqual( {
			user: {
				preferences: {
					notifications: {
						email: false,
					},
				},
			},
		}, );
		expect( didItChange, ).toBe( true, );
	}, );

	it( 'should correctly handle null in the prop path', () => {
		const target = {
			user: { details: null, },
		};
		const changes: Record<string, unknown> = {};

		const didItChange = applyChange( ['user', 'details', 'name',], target, changes, 'Jane', );

		expect( didItChange, ).toBe( false, );
	}, );

	it( 'should correctly handle null in the prop path when number is used', () => {
		const target = {
			details: null,
		};
		const changes: Record<string, unknown> = {};

		const didItChange = applyChange( ['details', 1, 'name',], target, changes, 'Jane', );

		expect( didItChange, ).toBe( false, );
	}, );
}, );
