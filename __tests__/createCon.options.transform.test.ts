import { describe, expect, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - options.transform', () => {
	it( 'should apply transform when resetting state and no changes', () => {
		const transformedInitial = {
			counter: 5,
			list: ['transformed',],
		};

		const estado = createCon( {
			counter: 0,
			list: ['item1',],
		}, {
			transform: ( { draft, }, ) => {
				draft.initial.counter = 5;
				draft.initial.list = ['transformed',];
				draft.state.counter = 5;
				draft.state.list = ['transformed',];
			},
		}, );

		// Modify state first
		estado.set( ( { draft, }, ) => {
			draft.counter = 10;
			draft.list.push( 'item2', );
		}, );

		// Reset should apply transform
		estado.reset();
		const newHistory = estado.get();

		expect( newHistory.initial, ).toStrictEqual( transformedInitial, );
		expect( newHistory.state, ).toStrictEqual( transformedInitial, );
		expect( newHistory.changes, ).toBeUndefined();
	}, );

	it( 'should use transform and patches to update state conditionally', () => {
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
			transform: ( { draft, patches, }, ) => {
				if ( patches?.state?.nested?.test?.example === 'test' ) {
					draft.state.counter = 5;
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

	it( 'should apply transform when resetting state with changes', () => {
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
				transform: ( { draft, type, }, ) => {
					if ( type === 'reset' ) {
						draft.state.type = 'reset';
					}
				},
			},
		);

		// Modify state first
		estado.set( ( { draft, }, ) => {
			draft.counter = 10;
		}, );

		expect( estado.get( 'state.type', ), ).toBe( '', );

		// Reset should apply transform
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
