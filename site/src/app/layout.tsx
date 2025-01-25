import './globals.css';

import type { Metadata, } from 'next';
import { Inter, } from 'next/font/google';
import { PropsWithChildren, } from 'react';

const inter = Inter( { subsets: ['latin',], }, );

export const metadata: Metadata = {
	title: 'estado Documentation',
	description: 'Documentation for estado',
};

export default function RootLayout( props: PropsWithChildren, ) {
	return <html lang="en" className="flex size-full flex-col bg-black">
		<body
			className={`${inter.className} relative flex grow overflow-x-hidden bg-black text-white`}
		>
			<main className="relative z-10 flex grow flex-col overflow-x-hidden">
				{props.children}
			</main>
		</body>
	</html>;
}
