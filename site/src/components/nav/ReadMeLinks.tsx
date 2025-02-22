import type { MDXComponents, } from 'mdx/types';
import type { PropsWithChildren, } from 'react';

import ReadMe from '../../../../README.md';
import Code from '../ui/code';
import NavLi from './Li';

const nullOp = () => null;
const childrenOp = ( props: PropsWithChildren, ) => props.children;

const components: MDXComponents = {
	h1: () => null,
	h2( props, ) {
		if ( props.children === 'Docs' ) {
			return null;
		}
		return <NavLi {...{
			...props,
			wrapperClassName: 'sticky top-0 z-20',
		}} />;
	},
	h3( props, ) {
		return <NavLi {...{
			...props,
			liClassName: 'z-10 pl-3',
		}} />;
	},
	h4( props, ) {
		return <NavLi {...{
			...props,
			liClassName: 'z-10 pl-6',
		}} />;
	},
	// Catch all other elements and return null
	a: childrenOp,
	code: Code,
	blockquote: nullOp,
	em: nullOp,
	hr: nullOp,
	img: nullOp,
	li: nullOp,
	ol: nullOp,
	p: nullOp,
	pre: nullOp,
	strong: nullOp,
	ul: nullOp,
};

export default function ReadMeLinks() {
	return <ReadMe {...{ components, }} />;
}
