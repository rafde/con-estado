import type { PropsWithChildren, } from 'react';
import childrenToString from '../../util/childrenToString';
import mdHToHref from '../../util/md-h-to-href';
import NavTopicInView from './navTopicInView';
import { cn, } from '@/lib/utils';

export default function NavLi(
	{
		children,
		liClassName = '',
		wrapperClassName = '',
	}: PropsWithChildren<{ liClassName?: string
		wrapperClassName?: string }>,
) {
	const title = childrenToString( children, );
	const href = mdHToHref( title, );

	return <li className={cn( 'group/nav-li', liClassName, )}>
		<div className={cn( 'peer/folder relative flex border-l bg-black py-2 pl-2 peer-checked/viewing-topic:bg-slate-700 pr-4', wrapperClassName, )}>
			<NavTopicInView href={href} />
			<a href={`#${href}`} aria-label={`Go to ${title} section`} className="mr-auto grow overflow-hidden text-wrap break-words hover:underline">
				{children}
			</a>
		</div>
	</li>;
}
