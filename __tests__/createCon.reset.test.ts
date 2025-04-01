import { afterEach, expect, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createCon - reset', () => {
	// Define the initial state
	const initialState = {
		counter: 0,
		list: ['item1',],
	};
	let estado = createCon( initialState, );
	let history = estado.get();
	afterEach( () => {
		estado = createCon( initialState, );
		history = estado.get();
	}, );

	it( 'should not reset the state when reset is made', () => {
		estado.reset();
		expect( history, ).toBe( estado.get(), );
	}, );

	it( 'should reset the state to the initial value', () => {
		const changes = {
			counter: 10,
			list: [undefined, 'item2',],
		};

		estado.commit( ( { state, }, ) => {
			state.counter = 10;
			state.list.push( 'item2', );
		}, );

		expect( history, ).not.toStrictEqual( estado.get(), );
		// Verify the state has been modified
		expect( estado.get( 'state.counter', ), ).toBe( 10, );
		expect( estado.get( 'state.list', ), ).toEqual( ['item1', 'item2',], );
		expect( estado.get( 'prev', ), ).toBe( history.state, );
		expect( estado.get( 'changes', ), ).toStrictEqual( changes, );
		expect( estado.get( 'prevInitial', ), ).toBe( undefined, );

		const prev = estado.get( 'state', );
		// Reset the state using createActProps.reset()
		estado.reset();

		const newHistory = estado.get();

		// Verify the state has been reset
		expect( newHistory.state, ).toBe( history.initial, );
		expect( newHistory.state.counter, ).toBe( 0, );
		expect( newHistory.state.list, ).toEqual( ['item1',], );
		expect( newHistory.prev, ).toStrictEqual( prev, );
		expect( newHistory.prevInitial, ).toBe( undefined, );
	}, );

	it( 'should reset the state using new initial', () => {
		const newInitial = {
			counter: 10,
			list: ['new', 'initial',],
		};

		estado.set( 'initial', newInitial, );
		estado.reset();
		const testHistory = estado.get();

		expect( testHistory.initial, ).toBe( newInitial, );
		expect( testHistory.prevInitial, ).toBe( newInitial, );
	}, );

	it( 'should update initial state when modified in beforeChange during reset', () => {
		const initialState = {
			counter: 0,
			list: ['item1',],
		};

		const estado = createCon( initialState, {
			beforeChange: ( { historyDraft, }, ) => {
				// Modify initial state during reset
				historyDraft.initial.counter = 100;
				historyDraft.initial.list = ['modified',];
			},
		}, );

		// First modify the state
		estado.commit( ( { state, }, ) => {
			state.counter = 50;
			state.list.push( 'item2', );
		}, );

		// Then reset
		estado.reset();
		const newHistory = estado.get();

		// Verify initial state was updated
		expect( newHistory.initial, ).not.toBe( initialState, );
		expect( newHistory.initial, ).toEqual( {
			counter: 100,
			list: ['modified',],
		}, );
		// Verify state matches the new initial
		expect( newHistory.state, ).toEqual( newHistory.initial, );
	}, );
}, );
