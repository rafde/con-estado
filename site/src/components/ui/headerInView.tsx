'use client';

import { useEffect, useRef, } from 'react';
import useTopicView from '../../hooks/useTopicView';

export default function TopicInView( { href, }: { href: string }, ) {
	const elRef = useRef<HTMLDivElement>( null, );
	const topicObserver = useTopicView( ( { acts, }, ) => acts.topicObserver(), );
	useEffect( () => {
		if ( elRef.current == null || !topicObserver ) {
			return;
		}
		const el = elRef.current;
		if ( !el ) {
			return;
		}

		topicObserver.observe( el, );
		return () => {
			topicObserver.unobserve( el, );
		};
	}, [topicObserver,], );
	return <div className="opacity-0 absolute inset-0 -z-10" ref={elRef} data-href={href} id={href} />;
}
