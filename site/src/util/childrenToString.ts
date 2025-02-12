import type { ReactNode, } from 'react';
import getHChildProp from './getHChildProp';

export default function childrenToString( children: ReactNode, ) {
	return ( Array.isArray( children, ) ? children : [children,] ).map( getHChildProp, ).join( '', );
}
