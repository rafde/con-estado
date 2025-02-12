'use client';
import { createConStore, } from 'con-estado';

const useNav = createConStore(
	{
		isNavOverlayOpen: false,
		isNavOpen: true,
	},
	{
		acts( { set, setWrap, }, ) {
			return {
				open() {
					set( {
						isNavOverlayOpen: true,
						isNavOpen: true,
					}, );
				},
				close() {
					set( {
						isNavOverlayOpen: false,
						isNavOpen: false,
					}, );
				},
				toggle: setWrap( ( { draft, }, ) => {
					const isNavOpen = !draft.isNavOpen;
					draft.isNavOpen = isNavOpen;
					if ( !isNavOpen ) {
						draft.isNavOverlayOpen = false;
					}
				}, ),
			};
		},
	},
	( { acts: { open, close, toggle, }, state: { isNavOverlayOpen, isNavOpen, }, }, ) => ( {
		isNavOverlayOpen,
		isNavOpen,
		open,
		close,
		toggle,
	} ),
);

export default useNav;
