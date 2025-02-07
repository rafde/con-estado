import { createCustomEqual, } from 'fast-equals';

const isEqual = createCustomEqual( {
	strict: true,
	createCustomConfig() {
		return {
			areFunctionsEqual: () => true,
		};
	},
}, );

export default function returnOnChange( prev: unknown, next: unknown, ) {
	if ( prev == null ) {
		return next;
	}

	if ( !isEqual( prev, next, ) ) {
		return next;
	}

	return prev;
}
