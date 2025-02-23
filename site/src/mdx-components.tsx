import type { MDXComponents, } from 'mdx/types';
import type { ReactNode, } from 'react';

let hasRemoveDocRef = false;
function removeDocRef( children: ReactNode, ) {
	if ( hasRemoveDocRef ) {
		return children;
	}

	if ( !Array.isArray( children, ) ) {
		return children;
	}

	const [
		first,
	] = children;

	if ( typeof first !== 'string' ) {
		return children;
	}

	if ( first.startsWith( 'For full documentation', ) ) {
		hasRemoveDocRef = true;
		return null;
	}
}

export function useMDXComponents( components: MDXComponents, ): MDXComponents {
	return {
		h1( props, ) {
			return props.children;
		},
		h2( props, ) {
			if ( props.children === 'Docs' ) {
				return null;
			}
			return props.children;
		},
		p( props, ) {
			const children = removeDocRef( props.children, );
			if ( children == null ) {
				return children;
			}
			return <p>{children}</p>;
		},
		...components,
	};
}
