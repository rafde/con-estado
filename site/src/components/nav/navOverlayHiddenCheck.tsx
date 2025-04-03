'use client';
import useNav from '../../hooks/useNav';

function onChange() {
}

export default function NavOverlyHiddenCheck() {
	const isOverlayNavOpen = useNav( 'state.isNavOverlayOpen', );
	return <input type="checkbox" className="peer/overlay hidden" checked={isOverlayNavOpen} onChange={onChange} />;
}
