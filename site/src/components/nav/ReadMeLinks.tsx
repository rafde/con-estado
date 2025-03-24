import fs from 'fs';
import path from 'path';
import type { MDXComponents, } from 'mdx/types';
import type { PropsWithChildren, } from 'react';
import Code from '../ui/code';
import NavLi from './Li';
import { MDXRemote, } from 'next-mdx-remote/rsc';

const fileContent = fs.readFileSync( path.join( process.cwd(), '../README.md', ), { encoding: 'utf8', }, );

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
	h5( props, ) {
		return <NavLi {...{
			...props,
			liClassName: 'z-10 pl-9',
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

const ReadMeMDX = <MDXRemote
	source={fileContent}
	components={components}
	options={{
		mdxOptions: {
			remarkPlugins: [
				() => ( tree, ) => {
					const visit = ( node: {
						name: string
						children: unknown
					}, ) => {
						if ( node.name === 'section' ) {
							return node.children;
						}
						return node;
					};
					tree.children = tree.children.map( visit, ).flat();
				},
			],
		},
	}}
/>;

export default function ReadMeLinks() {
	return ReadMeMDX;
}
