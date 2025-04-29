import { waitFor, } from '@testing-library/react';
import { afterEach, describe, } from 'vitest';
import createCon from '../src/_internal/createCon';

describe( 'createConBase - option.afterChange()', () => {
	const initialState = {
		counter: 0,
		list: ['item1',],
	};
	let afterChange = vi.fn();
	let estado = createCon( initialState, { afterChange, }, );
	afterEach( () => {
		afterChange = vi.fn();
		estado = createCon( initialState, { afterChange, }, );
	}, );

	it( 'should call the afterChange callback after the state is updated', async() => {
		estado.commit( ( { state, }, ) => {
			state.counter = 10;
			state.list.push( 'item2', );
		}, );

		expect( estado.get( 'state.counter', ), ).toBe( 10, );
		expect( estado.get( 'state.list', ), ).toEqual( ['item1', 'item2',], );
		await waitFor( () => {
			expect( afterChange, ).toHaveBeenCalledTimes( 1, );
		}, );
		await waitFor( () => {
			expect( afterChange, ).toBeCalledWith(
				estado.get(),
				{
					state: {
						counter: 10,
						list: [, 'item2',],
					},
				},
			);
		}, );
	}, );
}, );
