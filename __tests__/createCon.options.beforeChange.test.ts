import { describe, expect, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - options.beforeChange', () => {
	it( 'should apply beforeChange when resetting state and no changes', () => {
		const transformedInitial = {
			counter: 5,
			list: ['transformed',],
		};

		const estado = createCon( {
			counter: 0,
			list: ['item1',],
		}, {
			beforeChange: ( { historyDraft, }, ) => {
				historyDraft.initial.counter = 5;
				historyDraft.initial.list = ['transformed',];
				historyDraft.state.counter = 5;
				historyDraft.state.list = ['transformed',];
			},
		}, );

		// Modify state first
		estado.commit( ( { state, }, ) => {
			state.counter = 10;
			state.list.push( 'item2', );
		}, );

		// Reset should apply beforeChange
		estado.reset();
		const newHistory = estado.get();

		expect( newHistory.initial, ).toStrictEqual( transformedInitial, );
		expect( newHistory.state, ).toStrictEqual( transformedInitial, );
		expect( newHistory.changes, ).toBeUndefined();
	}, );

	it( 'should use beforeChange and patches to update state conditionally', () => {
		const estado = createCon( {
			counter: 0,
			nested: {
				test: {
					example: 'example',
				},
			},
		}, {
			beforeChange: ( { patches, type, }, ) => {
				expect( patches, ).toStrictEqual( {
					state: {
						nested: {
							test: {
								example: 'test',
							},
						},
					},
				}, );
				expect( type, ).toBe( 'commit', );
			},
		}, );

		// Modify state first
		estado.commit( ( { state, }, ) => {
			state.nested.test.example = 'test';
		}, );
	}, );

	it( 'should apply beforeChange when resetting state with changes', () => {
		const changes = {
			type: 'reset',
		};
		const iS = {
			counter: 0,
			list: ['item1',],
			type: '',
		};
		const estado = createCon(
			iS,
			{
				beforeChange: ( { historyDraft, type, }, ) => {
					if ( type === 'reset' ) {
						historyDraft.state.type = 'reset';
					}
				},
			},
		);

		// Modify state first
		estado.commit( ( { state, }, ) => {
			state.counter = 10;
		}, );

		expect( estado.get( 'state.type', ), ).toBe( '', );

		// Reset should apply beforeChange
		estado.reset();
		const newHistory = estado.get();

		expect( newHistory.initial, ).toStrictEqual( iS, );
		expect( newHistory.state, ).toStrictEqual( {
			...iS,
			...changes,
		}, );
		expect( newHistory.changes, ).toStrictEqual( changes, );
	}, );

	it( 'should handle beforeChange with multiple operations in sequence', () => {
		const operations: string[] = [];
		const estado = createCon( {
			counter: 0,
			list: ['item1',],
		}, {
			beforeChange: ( { type, historyDraft, }, ) => {
				operations.push( type, );
				if ( type === 'commit' ) {
					historyDraft.state.counter *= 2;
				}
			},
		}, );

		estado.commit( ( { state, }, ) => {
			state.counter = 5;
		}, );

		estado.set( { state: { list: ['item2',],
			counter: 10, }, }, );

		estado.merge( { state: { counter: 15, }, }, );

		expect( operations, ).toEqual( ['commit', 'set', 'merge',], );
		expect( estado.get( 'state.counter', ), ).toBe( 15, ); // 15 * 2 from beforeChange
	}, );

	it( 'should allow beforeChange to prevent modifications by reverting values', () => {
		const estado = createCon( {
			sensitive: 'original',
			normal: 'value',
		}, {
			beforeChange: ( { historyDraft, patches, }, ) => {
				if ( patches?.state?.sensitive ) {
					// Revert any changes to sensitive field
					historyDraft.state.sensitive = historyDraft.initial.sensitive;
				}
			},
		}, );

		estado.commit( ( { state, }, ) => {
			state.sensitive = 'modified';
			state.normal = 'changed';
		}, );

		const history = estado.get();
		expect( history.state.sensitive, ).toBe( 'original', );
		expect( history.state.normal, ).toBe( 'changed', );
	}, );

	it( 'should handle array operations in beforeChange', () => {
		const estado = createCon( {
			list: [1, 2, 3,],
		}, {
			beforeChange: ( { historyDraft, }, ) => {
				// Always sort the array after any change
				historyDraft.state.list.sort( ( a, b, ) => a - b, );
			},
		}, );

		estado.commit( ( { state, }, ) => {
			state.list.push( 0, );
			state.list.unshift( 4, );
		}, );

		expect( estado.get( 'state.list', ), ).toEqual( [0, 1, 2, 3, 4,], );
	}, );

	it( 'should provide correct patches for nested updates', () => {
		const patchHistory: Array<unknown> = [];
		const estado = createCon( {
			user: {
				profile: {
					name: 'John',
					settings: {
						theme: 'light',
					},
				},
			},
		}, {
			beforeChange: ( { patches, }, ) => {
				patchHistory.push( patches, );
			},
		}, );

		estado.commit( ( { state, }, ) => {
			state.user.profile.settings.theme = 'dark';
		}, );

		estado.merge( {
			state: {
				user: {
					profile: {
						name: 'Jane',
					},
				},
			},
		}, );

		expect( patchHistory, ).toEqual( [
			{
				state: {
					user: {
						profile: {
							settings: {
								theme: 'dark',
							},
						},
					},
				},
			},
			{
				state: {
					user: {
						profile: {
							name: 'Jane',
						},
					},
				},
			},
		], );
	}, );

	it( 'should handle beforeChange with wrap operations', () => {
		const estado = createCon( {
			counter: 0,
		}, {
			beforeChange: ( { historyDraft, type, }, ) => {
				if ( type === 'wrap' ) {
					historyDraft.state.counter += 100;
				}
			},
		}, );

		const increment = estado.wrap( ( { state, }, ) => {
			state.counter += 1;
		}, );

		increment();
		expect( estado.get( 'state.counter', ), ).toBe( 101, );
	}, );

	it( 'should maintain type safety in beforeChange modifications', () => {
		const estado = createCon( {
			count: 0,
			items: [] as string[],
			meta: {
				lastUpdated: 0,
				tags: [] as string[],
			},
		}, {
			beforeChange: ( { historyDraft, }, ) => {
				historyDraft.state.meta.lastUpdated = Date.now();
				historyDraft.state.meta.tags.push( 'modified', );
			},
		}, );

		estado.commit( ( { state, }, ) => {
			state.count = 5;
			state.items.push( 'test', );
		}, );

		const history = estado.get();
		expect( history.state.meta.lastUpdated, ).toBeGreaterThan( 0, );
		expect( history.state.meta.tags, ).toContain( 'modified', );
	}, );

	it( 'should handle conditional modifications based on operation type', () => {
		const estado = createCon( {
			value: 0,
			history: [] as string[],
		}, {
			beforeChange: ( { historyDraft, type, }, ) => {
				historyDraft.state.history.push( `${type}-${Date.now()}`, );

				switch ( type ) {
					case 'commit':
						historyDraft.state.value *= 2;
						break;
					case 'merge':
						historyDraft.state.value += 10;
						break;
					case 'set':
						historyDraft.state.value -= 5;
						break;
				}
			},
		}, );

		estado.commit( ( { state, }, ) => {
			state.value = 5;
		}, );
		estado.merge( { state: { value: 20, }, }, );
		estado.set( {
			state: {
				value: 100,
				history: [...estado.get( 'state.history', ),],
			},
		}, );

		const history = estado.get();
		expect( history.state.history.length, ).toBe( 3, );
		expect( history.state.history[ 0 ], ).toMatch( /^commit-\d+$/, );
		expect( history.state.history[ 1 ], ).toMatch( /^merge-\d+$/, );
		expect( history.state.history[ 2 ], ).toMatch( /^set-\d+$/, );
		expect( history.state.value, ).toBe( 95, ); // 100 - 5 from last set operation
	}, );
}, );
