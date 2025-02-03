import { waitFor, } from '@testing-library/react';
import { afterEach, describe, } from 'vitest';
import createConBase from '../src/_internal/createConBase';

describe( 'createConBase - option.afterChange()', () => {
	const initialState = {
		counter: 0,
		list: ['item1',],
	};
	let afterChange = vi.fn();
	let estado = createConBase( initialState, { afterChange, }, );
	afterEach( () => {
		afterChange = vi.fn();
		estado = createConBase( initialState, { afterChange, }, );
	}, );

	it( 'should call the afterChange callback after the state is updated', async() => {
		estado.set( ( { draft, }, ) => {
			draft.state.counter = 10;
			draft.state.list.push( 'item2', );
		}, );

		expect( estado.get( 'state.counter', ), ).toBe( 10, );
		expect( estado.get( 'state.list', ), ).toEqual( ['item1', 'item2',], );
		await waitFor( () => {
			expect( afterChange, ).toHaveBeenCalledTimes( 1, );
		}, );
		await waitFor( () => {
			expect( afterChange, ).toBeCalledWith( estado.get(), );
		}, );
	}, );
}, );
