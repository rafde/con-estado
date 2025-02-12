'use client';

import useNav from '../../hooks/useNav';

function onChange() {
}

export default function NavHiddenCheck() {
	const isNavOpen = useNav( ( { state: { isNavOpen, }, }, ) => isNavOpen, );
	return <input type="checkbox" className="peer/side hidden" checked={isNavOpen} onChange={onChange} />;
}
