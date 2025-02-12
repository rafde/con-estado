import { isValidElement, } from 'react';

export default function getHChildProp( value: unknown, ) {
	if ( isValidElement( value, ) ) {
		// @ts-expect-error trying
		return value.props?.children as string;
	}
	return value;
}
