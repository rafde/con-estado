import { waitFor, } from '@testing-library/react';
import { afterEach, describe, } from 'vitest';
import { createEstado, } from '../src';

describe( 'option.afterChange()', () => {
	const initialState = {
		counter: 0,
		list: ['item1',],
	};
	let afterChangeMock = vi.fn();
	let estado = createEstado( initialState, { afterChange: afterChangeMock, }, );
	afterEach( () => {
		afterChangeMock = vi.fn();
		estado = createEstado( initialState, { afterChange: afterChangeMock, }, );
	}, );

	it( 'should call the afterChange callback after the state is updated', async() => {
		estado.set( ( { draft, }, ) => {
			draft.state.counter = 10;
			draft.state.list.push( 'item2', );
		}, );

		expect( estado.get( 'state.counter', ), ).toBe( 10, );
		expect( estado.get( 'state.list', ), ).toEqual( ['item1', 'item2',], );
		await waitFor( () => {
			expect( afterChangeMock, ).toHaveBeenCalledTimes( 1, );
		}, );
		await waitFor( () => {
			expect( afterChangeMock, ).toBeCalledWith( estado.get(), );
		}, );
	}, );
}, );
