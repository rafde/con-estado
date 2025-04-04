'use client';
import { PanelLeftClose, PanelLeftOpen, } from 'lucide-react';
import useNav from '../../hooks/useNav';

export default function NavToggleButton() {
	const isNavOpen = useNav( 'state.isNavOpen', );
	const toggle = useNav( 'acts.toggle', );

	return <button aria-label={`${isNavOpen ? 'Close' : 'Open'} Navigation`} className="fixed z-20 ml-1 mt-4 hidden bg-black sm:block" onClick={toggle} type="button">
		<PanelLeftClose className={`${isNavOpen ? '' : 'hidden'}`} />
		<PanelLeftOpen className={`${isNavOpen ? 'hidden' : ''}`} />
	</button>;
}
