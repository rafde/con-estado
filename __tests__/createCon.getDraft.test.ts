import { isDraft, } from 'mutative';
import { expect, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe.skip( 'createCon - getDraft', () => {
	// Define the initial state
	const initialState = {
		counter: 0,
		list: ['item1',],
	};
	let estado = createCon( initialState, );
	afterEach( () => {
		estado = createCon( initialState, );
	}, );

	it( 'should return a historyDraft object and a commit function using getDraft', () => {
		// Get the historyDraft and commit function
		// @ts-expect-error -- disabled for now
		const [draft, commit,] = estado.getDraft();

		// Modify the historyDraft
		draft.state.counter = 10;
		draft.state.list.push( 'item2', );

		// Commit the changes
		const newState = commit();

		// Verify the historyDraft modifications
		expect( newState.state.counter, ).toBe( 10, );
		expect( newState.state.list, ).toEqual( ['item1', 'item2',], );
		expect( newState.changes, ).toEqual( {
			counter: 10,
			list: ['item1', 'item2',],
		}, );
		const newHistory = estado.get();
		// Verify the state has been updated
		expect( newHistory.state.counter, ).toBe( 10, );
		expect( newHistory.state.list, ).toEqual( ['item1', 'item2',], );
		expect( newHistory.prev, ).toStrictEqual( initialState, );
	}, );

	it( 'should return a historyDraft object and a commit function using getDraft', () => {
		// @ts-expect-error -- disabled for now
		const [draft, commit,] = estado.getDraft( 'state.list', );

		expect( isDraft( draft, ), ).toBe( true, );
		expect( commit, ).toBeTypeOf( 'function', );
	}, );

	it( 'should return a historyDraft object and a commit function using getDraft', () => {
		expect(
			// @ts-expect-error -- should throw error
			() => estado.getDraft( 'state.list.0', ),
		).toThrowError( /cannot be a draft/, );
	}, );
}, );
