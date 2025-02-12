import { describe, expect, } from 'vitest';
import createCon from '../src/_internal/createCon';

const ERROR_REGEX = /Only works with plain objects or arrays/;
describe( 'createConBase', () => {
	it( 'should create a new base from object', () => {
		const initial = {
			n: 1,
			o: {
				on: 2,
			},
			oo: {
				ooa: [
					1,
				],
			},
			ooo: {
				oooa: [
					{
						s: 's',
					},
				],
			},
		};
		const estado = createCon( initial, );
		expect( estado.get( 'state', ), ).toStrictEqual( initial, );
		expect( estado.get( 'initial', ), ).toStrictEqual( initial, );
		expect( estado.get( 'changes', ), ).toBe( undefined, );
		expect( estado.get( 'prevInitial', ), ).toBe( undefined, );
		expect( estado.get( 'prev', ), ).toBe( undefined, );
	}, );

	it( 'should create a new base with array initial state', () => {
		const initial = [
			{
				n: 1,
				o: {
					on: 2,
				},
			},
		];
		const estado = createCon( initial, );
		expect( estado.get( 'state', ), ).toStrictEqual( initial, );
		expect( estado.get( 'initial', ), ).toStrictEqual( initial, );
		expect( estado.get( 'changes', ), ).toBe( undefined, );
		expect( estado.get( 'prevInitial', ), ).toBe( undefined, );
		expect( estado.get( 'prev', ), ).toBe( undefined, );
	}, );

	it( 'should handle undefined or null initial state', () => {
		// @ts-expect-error -- checking invalid value
		expect( () => createCon( null, ), ).toThrowError( ERROR_REGEX, );

		// @ts-expect-error -- checking invalid value
		expect( () => createCon( undefined, ), ).toThrowError( ERROR_REGEX, );
	}, );

	it( 'should handle invalid selector functions', () => {
		// @ts-expect-error -- checking invalid value
		expect( () => createCon( null as unknown, ), ).toThrowError( ERROR_REGEX, );
	}, );
}, );
