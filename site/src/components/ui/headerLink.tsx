import { Link as ChainLink, } from 'lucide-react';
import type { PropsWithChildren, } from 'react';

import { cn, } from '../../lib/utils';
import TopicInView from './headerInView';

export type HeaderLinkProps = {
	href: string
	title: string
	wrapperClassName?: string
	headerClassName?: string
	Header?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
};

export default function HeaderLink( props: PropsWithChildren<HeaderLinkProps>, ) {
	const {
		wrapperClassName = 'sticky top-0 z-10',
		headerClassName = 'text-3xl',
		Header = 'h4',
		title,
		children = title,
		href,
	} = props;
	return <>
		<div className={cn( 'group flex flex-row contents-center gap-2 border-b border-b-white bg-black py-2 pl-4 pr-2', wrapperClassName, )}>
			{props.href && <a href={`#${href}`} className="mt-3 flex flex-col self-start" aria-label={`Section anchor for ${title}`}>
				<ChainLink className="size-4 self-center" />
			</a>}
			<Header className={cn( 'overflow-hidden text-wrap break-words', headerClassName, )} aria-label={title}>{children}</Header>
		</div>
		<TopicInView href={href} />
	</>;
}
