import type { NavItem, SidebarNavItem } from '$docs/types';

export const siteConfig = {
	name: 'Melt UI',
	url: 'https://melt-ui.com',
	ogImage: 'https://melt-ui.com/og.jpg',
	description:
		'An open-source collection of accessible & customizable component builders for creating user interfaces with Svelte.',
	links: {
		github: 'https://github.com/melt-ui/melt-ui',
		discord: 'https://discord.gg/cee8gHrznd',
	},
	keywords: 'meltui,svelte,sveltekit,sveltekit components,svelte headless, radix svelte',
};

type NavConfig = {
	mainNav: NavItem[];
	sidebarNav: SidebarNavItem[];
};

export const navConfig: NavConfig = {
	mainNav: [
		{
			title: 'Docs',
			href: '/docs',
		},
		{
			title: 'Builders',
			href: '/docs/builders',
		},
	],
	sidebarNav: [],
};
