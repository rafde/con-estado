import './globals.css';

import type { Metadata, } from 'next';
import type { PropsWithChildren, } from 'react';

import { Inter, } from 'next/font/google';
import NavOverlayOpenButton from '../components/nav/navOverlayOpenButton';
import NavSidebar from '../components/nav/navSidebar';
import NavToggleButton from '../components/nav/navToggleButton';

const inter = Inter( { subsets: ['latin',], }, );

export const metadata: Metadata = {
	title: 'con-estado Documentation',
	description: 'Documentation for con-estado',
};

export default function RootLayout( props: PropsWithChildren, ) {
	return <html lang="en" className="flex size-full flex-col bg-black">
		<body
			className={`${inter.className} relative flex grow overflow-x-hidden bg-black text-white`}
		>
			<NavSidebar />
			<main className="relative flex grow flex-col overflow-x-hidden z-0">
				<NavToggleButton />
				<NavOverlayOpenButton />
				{props.children}
			</main>
		</body>
	</html>;
}
