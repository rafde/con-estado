import Image from 'next/image';
import type { MDXComponents, } from 'mdx/types';
import type { ReactNode, } from 'react';
import ReadMe from '../../../../README.md';
import childrenToString from '../../util/childrenToString';
import mdHToHref from '../../util/md-h-to-href';
import Anchor from '../ui/anchor';
import Code from '../ui/code';
import CodeBlock from '../ui/codeBlock';
import HeaderLink from '../ui/headerLink';
import { ExternalLink, } from 'lucide-react';

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

	if ( first.includes( 'For full documentation', ) ) {
		hasRemoveDocRef = true;
		return null;
	}
}

const components: MDXComponents = {
	a( props, ) {
		if ( props.href.startsWith( 'https://stackblitz', ) ) {
			return <iframe
				src={props.href}
				className="h-[800px] w-full overflow-hidden rounded-s border-0"
				title={childrenToString( props.children, )}
				sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
			/>;
		}
		let _props = props;

		if ( props.href.startsWith( 'https', ) ) {
			_props = {
				..._props,
				target: '_blank',
				className: 'inline-flex items-center',
				children: <>
					{props.children}
					<ExternalLink size={12} className="text-blue-400 self-start" />
				</>,
			};
		}

		return <Anchor {..._props} />;
	},
	h1( props, ) {
		return <HeaderLink
			Header="h1"
			title={childrenToString( props.children, )}
			href={mdHToHref( props.children, )}
		>
			{props.children}
		</HeaderLink>;
	},
	h2( props, ) {
		if ( props.children === 'Docs' ) {
			return null;
		}
		return <HeaderLink
			Header="h2"
			title={childrenToString( props.children, )}
			href={mdHToHref( props.children, )}
		>
			{props.children}
		</HeaderLink>;
	},
	h3( props, ) {
		return <HeaderLink
			Header="h3"
			title={childrenToString( props.children, )}
			href={mdHToHref( props.children, )}
		>
			{props.children}
		</HeaderLink>;
	},
	h4( props, ) {
		return <HeaderLink
			Header="h3"
			title={childrenToString( props.children, )}
			href={mdHToHref( props.children, )}
		>
			{props.children}
		</HeaderLink>;
	},
	p( props, ) {
		const children = removeDocRef( props.children, );
		if ( children == null ) {
			return children;
		}
		return <p>{children}</p>;
	},
	code( props, ) {
		return <Code {...props} />;
	},
	pre( props, ) {
		const { children, } = props;
		if ( Array.isArray( children, ) ) {
			return <pre>{children}</pre>;
		}
		const lang = children.props.className?.replaceAll( 'language-', '', );

		if ( !lang ) {
			return <pre>{children}</pre>;
		}
		const propsChildren = children.props.children;

		if ( typeof propsChildren === 'string' && propsChildren.startsWith( '// Demo', ) ) {
			return null;
		}

		return <CodeBlock lang={lang} copyButton={lang === 'shell'}>
			{propsChildren}
		</CodeBlock>;
	},
	ol( props, ) {
		return <ol className="list-inside list-decimal">{props.children}</ol>;
	},
	ul( props, ) {
		return <ol className="list-inside list-[circle] in-[ul,ol]:list-[square]">{props.children}</ol>;
	},
	li( props, ) {
		return <li className="[&>ol,ul]:pl-4">{props.children}</li>;
	},
	img( props, ) {
		const _props = {
			...props,
			className: 'inline-flex align-baseline h-[20px]',
			width: '75',
			height: '20',
		};
		switch ( props.alt ) {
			case 'Test': {
				_props.width = '110';
				_props.className += ' w-[110px]';
				break;
			}
			default:
				_props.className += ' w-[75px]';
				break;
		}
		return <Image {..._props} />;
	},
};

export default function README() {
	return <section className="pb-4 px-4 space-y-4">
		<ReadMe {...{ components, }} />
	</section>;
}
