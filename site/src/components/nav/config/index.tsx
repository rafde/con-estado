import type Link from 'next/link';

export type NavItem = Readonly<{
	desc?: Parameters<typeof Link>[0]['children']
	href: string
	navTitle?: Parameters<typeof Link>[0]['children']
	subNav?: Array<NavItem>
	title: string
}>;

export const navList: NavItem[] = [
];
