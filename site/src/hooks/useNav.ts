'use client';
import { createConStore, } from '../../../src';

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
);

export default useNav;
