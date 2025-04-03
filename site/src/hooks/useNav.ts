'use client';
import { createConStore, } from 'con-estado';

const useNav = createConStore(
	{
		isNavOverlayOpen: false,
		isNavOpen: true,
	},
	{
		acts( { set, wrap, }, ) {
			return {
				open() {
					set( 'state', {
						isNavOverlayOpen: true,
						isNavOpen: true,
					}, );
				},
				close() {
					set( 'state', {
						isNavOverlayOpen: false,
						isNavOpen: false,
					}, );
				},
				toggle: wrap( ( { state, }, ) => {
					const isNavOpen = !state.isNavOpen;
					state.isNavOpen = isNavOpen;
					if ( !isNavOpen ) {
						state.isNavOverlayOpen = false;
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
