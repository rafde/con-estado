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

		estado.setHistory( 'state', ( { draft, }, ) => {
			draft.counter = 10;
			draft.list.push( 'item2', );
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

		estado.setHistory( 'initial', newInitial, );
		estado.reset();
		const testHistory = estado.get();

		expect( testHistory.initial, ).toBe( newInitial, );
		expect( testHistory.prevInitial, ).toBe( newInitial, );
	}, );
}, );
