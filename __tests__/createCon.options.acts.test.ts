import { waitFor, } from '@testing-library/react';
import createCon from '../src/_internal/createCon';
import { describe, } from 'vitest';

describe( 'createCon -  options.acts', () => {
	it( 'should add custom actions via options.acts', async() => {
		// Define the initial state
		const initialState = {
			counter: 0,
			list: ['item1',],
		};

		// Create the estado instance with custom actions
		const estado = createCon(
			initialState,
			{
				acts: props => ( {
					increment() {
						props.setHistory( ( { historyDraft, }, ) => {
							historyDraft.state.counter += 1;
						}, );
					},
					addItem( item: string, ) {
						props.setHistory( ( { historyDraft, }, ) => {
							historyDraft.state.list.push( item, );
						}, );
					},
					async asyncIncrement() {
						return Promise.resolve().then( () => {
							props.setHistory( ( { historyDraft, }, ) => {
								historyDraft.state.counter += 10;
							}, );
						}, );
					},
				} ),
			},
		);

		// Verify the custom actions are available
		expect( estado.acts.increment, ).toBeDefined();
		expect( estado.acts.addItem, ).toBeDefined();

		// Use the custom actions to modify the state
		estado.acts.increment();
		estado.acts.addItem( 'item2', );

		// Verify the state has been updated
		expect( estado.get().state.counter, ).toBe( 1, );
		expect( estado.get().state.list, ).toEqual( ['item1', 'item2',], );

		await waitFor( async() => {
			await estado.acts.asyncIncrement();
			expect( estado.get().state.counter, ).toBe( 11, );
		}, );
	}, );
}, );
