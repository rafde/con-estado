'use client';
import { useEffect, useRef, } from 'react';
import useTopicView from '../../hooks/useTopicView';

export default function NavTopicInView( props: {
	href: string
}, ) {
	const {
		href,
	} = props;
	const isTopicViewing = useTopicView( ( { state, }, ) => state.firstTopicHref === href, );
	const elRef = useRef<HTMLSpanElement | null>( null, );

	useEffect(
		() => {
			const el = elRef.current;
			if ( !el ) {
				return;
			}
			if ( isTopicViewing ) {
				el.scrollIntoView( {
					behavior: 'smooth',
					block: 'nearest',
					inline: 'nearest',
				}, );
			}
		},
		[isTopicViewing,],
	);

	return <span ref={elRef} className={`absolute inset-0 -z-10 bg-slate-700 ${isTopicViewing ? 'opacity-100' : 'opacity-0'}`} />;
}
