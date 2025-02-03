import { describe, expect, } from 'vitest';
import { createConBase, } from '../src/';

describe( 'createConBase', () => {
	test( 'should create a new base from object', () => {
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
		const estado = createConBase( initial, );
		expect( estado.get( 'state', ), ).toStrictEqual( initial, );
		expect( estado.get( 'initial', ), ).toStrictEqual( initial, );
		expect( estado.get( 'changes', ), ).toBe( undefined, );
		expect( estado.get( 'priorInitial', ), ).toBe( undefined, );
		expect( estado.get( 'priorState', ), ).toBe( undefined, );
	}, );

	test( 'should create a new base with array initial state', () => {
		const initial = [
			{
				n: 1,
				o: {
					on: 2,
				},
			},
		];
		const estado = createConBase( initial, );
		expect( estado.get( 'state', ), ).toStrictEqual( initial, );
		expect( estado.get( 'initial', ), ).toStrictEqual( initial, );
		expect( estado.get( 'changes', ), ).toBe( undefined, );
		expect( estado.get( 'priorInitial', ), ).toBe( undefined, );
		expect( estado.get( 'priorState', ), ).toBe( undefined, );
	}, );

	it( 'should handle undefined or null initial state', () => {
		// @ts-expect-error -- checking invalid value
		expect( () => createConBase( null, ), ).toThrowError( /createCon can only work with/, );

		// @ts-expect-error -- checking invalid value
		expect( () => createConBase( undefined, ), ).toThrowError( /createCon can only work with/, );
	}, );

	it( 'should handle invalid selector functions', () => {
		// @ts-expect-error -- checking invalid value
		expect( () => createConBase( null as unknown, ), ).toThrowError( /createCon can only work with/, );
	}, );
}, );
