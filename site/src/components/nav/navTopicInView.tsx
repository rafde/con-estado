'use client';
import useTopicView from '../../hooks/useTopicView';

export default function NavTopicInView( props: {
	href: string
}, ) {
	const {
		href,
	} = props;
	const isTopicViewing = useTopicView( ( { state, }, ) => state.firstTopicHref === href, );

	return <span className={`absolute inset-0 -z-10 bg-slate-700 ${isTopicViewing ? 'opacity-100' : 'opacity-0'}`} />;
}
