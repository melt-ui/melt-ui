import type { NavItem, SidebarNavItem } from '$docs/types.js';
import { builderList } from './data/builders/index.js';
import { formatStr } from './utils/index.js';

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
	sidebarNav: [
		{
			title: 'Overview',
			items: [
				{
					title: 'Introduction',
					href: '/docs/introduction',
					items: [],
				},
				{
					title: 'Installation',
					href: '/docs/installation',
					items: [],
				},
				{
					title: 'Preprocessor',
					href: '/docs/preprocessor',
					items: [],
				},
				{
					title: 'Usage',
					href: '/docs/usage',
					items: [],
				},
				{
					title: 'Transitions',
					href: '/docs/transitions',
					items: [],
				},
				{
					title: 'Controlled',
					href: '/docs/controlled',
					items: [],
				},
				{
					title: 'API Reference',
					href: '/docs/api',
					items: [],
				},
			],
		},
		{
			title: 'Builders',
			items: builderList.map((builder) => {
				return {
					title: formatStr(builder),
					href: `/docs/builders/${builder}`,
					items: [],
				};
			}),
		},
	],
};
