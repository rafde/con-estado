'use client';
import { PanelLeftClose, } from 'lucide-react';
import useNav from '../../hooks/useNav';

export default function NavOverlayCloseButton() {
	const closeNavOverlay = useNav( ( { acts, }, ) => acts.close, );

	return <button aria-label="Close Navigation" className="mt-2.5 self-start sm:hidden" onClick={closeNavOverlay} type="button">
		<PanelLeftClose />
	</button>;
}
