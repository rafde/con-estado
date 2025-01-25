import { afterEach, expect, } from 'vitest';
import { createEstado, } from '../src';

describe( 'createEstado.reset', () => {
	// Define the initial state
	const initialState = {
		counter: 0,
		list: ['item1',],
	};
	let estado = createEstado( initialState, );
	let history = estado.get();
	afterEach( () => {
		estado = createEstado( initialState, );
		history = estado.get();
	}, );

	it( 'should not reset the state when reset is made', () => {
		estado.reset();
		expect( history, ).toStrictEqual( estado.get(), );
	}, );

	it( 'should reset the state to the initial value', () => {
		const changes = {
			counter: 10,
			list: ['item1', 'item2',],
		};
		// Modify the state using createActProps.set()
		estado.set( 'state', ( { draft, }, ) => {
			draft.counter = 10;
			draft.list.push( 'item2', );
		}, );

		expect( history, ).not.toStrictEqual( estado.get(), );
		// Verify the state has been modified
		expect( estado.get( 'state.counter', ), ).toBe( 10, );
		expect( estado.get( 'state.list', ), ).toEqual( ['item1', 'item2',], );
		expect( estado.get( 'priorState', ), ).toStrictEqual( history.state, );
		expect( estado.get( 'changes', ), ).toStrictEqual( changes, );
		expect( estado.get( 'priorInitial', ), ).toBeUndefined();

		// Reset the state using createActProps.reset()
		estado.reset();

		// Verify the state has been reset
		expect( estado.get( 'state.counter', ), ).toBe( 0, );
		expect( estado.get( 'state.list', ), ).toEqual( ['item1',], );
		expect( estado.get( 'priorState', ), ).toStrictEqual( changes, );
		expect( estado.get( 'priorInitial', ), ).toBeUndefined();
	}, );

	it( 'should not reset the state when reset is made', () => {
		const newInitial = {
			counter: 10,
			list: ['new', 'initial',],
		};
		estado.set( 'initial', newInitial, );
		estado.reset();
		expect( history.initial, ).not.toStrictEqual( estado.get(), );
		expect( estado.get( 'initial', ), ).not.toStrictEqual( newInitial, );
		expect( estado.get( 'state', ), ).not.toStrictEqual( newInitial, );
		expect( estado.get( 'priorInitial', ), ).not.toStrictEqual( initialState, );
		expect( estado.get( 'priorState', ), ).not.toStrictEqual( initialState, );
	}, );
}, );
