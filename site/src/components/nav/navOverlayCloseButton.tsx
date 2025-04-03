'use client';
import { PanelLeftClose, } from 'lucide-react';
import useNav from '../../hooks/useNav';

export default function NavOverlayCloseButton() {
	const closeNavOverlay = useNav( 'acts.close', );

	return <button aria-label="Close Navigation" className="self-center sm:hidden" onClick={closeNavOverlay} type="button">
		<PanelLeftClose />
	</button>;
}
