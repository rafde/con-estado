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
		estado.set( ( { draft, }, ) => {
			draft.counter = 10;
			draft.list.push( 'item2', );
		}, );

		// Reset should apply beforeChange
		estado.reset();
		const newHistory = estado.get();

		expect( newHistory.initial, ).toStrictEqual( transformedInitial, );
		expect( newHistory.state, ).toStrictEqual( transformedInitial, );
		expect( newHistory.changes, ).toBeUndefined();
	}, );

	it( 'should use beforeChange and patches to update state conditionally', () => {
		const transformedInitial = {
			counter: 5,
			nested: {
				test: {
					example: 'test',
				},
			},
		};

		const estado = createCon( {
			counter: 0,
			nested: {
				test: {
					example: 'example',
				},
			},
		}, {
			beforeChange: ( { historyDraft, patches, }, ) => {
				if ( patches?.state?.nested?.test?.example === 'test' ) {
					historyDraft.state.counter = 5;
				}
			},
		}, );

		// Modify state first
		estado.set( ( { draft, }, ) => {
			draft.nested.test.example = 'test';
		}, );
		const newHistory = estado.get();

		expect( newHistory.state, ).toStrictEqual( transformedInitial, );
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
		estado.set( ( { draft, }, ) => {
			draft.counter = 10;
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
}, );
