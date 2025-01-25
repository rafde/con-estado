import { describe, } from 'vitest';
import { createEstado, } from '../src/';

describe( 'createEstado', () => {
	test( 'should create a new estado from object', () => {
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
		const estado = createEstado( initial, );
		expect( estado.get( 'state', ), ).toStrictEqual( initial, );
		expect( estado.get( 'initial', ), ).toStrictEqual( initial, );
		expect( estado.get( 'changes', ), ).toBe( undefined, );
		expect( estado.get( 'priorInitial', ), ).toBe( undefined, );
		expect( estado.get( 'priorState', ), ).toBe( undefined, );
	}, );

	test( 'should create a new estado with array initial state', () => {
		const initial = [
			{
				n: 1,
				o: {
					on: 2,
				},
			},
		];
		const estado = createEstado( initial, );
		expect( estado.get( 'state', ), ).toStrictEqual( initial, );
		expect( estado.get( 'initial', ), ).toStrictEqual( initial, );
		expect( estado.get( 'changes', ), ).toBe( undefined, );
		expect( estado.get( 'priorInitial', ), ).toBe( undefined, );
		expect( estado.get( 'priorState', ), ).toBe( undefined, );
	}, );
}, );
