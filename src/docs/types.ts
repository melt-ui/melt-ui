import type { SvelteComponent } from 'svelte';

export type Metadata = {
	title: string;
	description: string;
	openGraph: {
		title: string;
		description: string;
		type: 'article';
		url: string;
		images: [
			{
				url: string;
				width: number;
				height: number;
				alt: string;
			}
		];
	};
	twitter: {
		card: 'summary_large_image';
		title: string;
		description: string;
		images: string[];
		creator: string;
	};
};

export type FrontMatter = {
	title: string;
	description: string;
	features: string[];
};

export type DocFile = {
	default: SvelteComponent;
	metadata: FrontMatter;
};

export type DocResolver = () => Promise<DocFile>;

export type PreviewFile = {
	default: SvelteComponent;
};

export type PreviewResolver = () => Promise<PreviewFile>;

export type TableOfContentsItem = {
	title: string;
	url: string;
	items?: TableOfContentsItem[];
};

export type TableOfContents = {
	items: TableOfContentsItem[];
};

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
};

export type SidebarNavItem = NavItem & {
	items: SidebarNavItem[];
};

export type NavItemWithChildren = NavItem & {
	items: NavItemWithChildren[];
};

export type Props = Array<{
	label: string;
	type: string | string[];
	default?: string;
	required?: boolean;
	description?: string;
}>;

export type Events = Array<{
	label: string;
	payload?: unknown;
}>;

export type DataAttributes = Array<{
	label: string;
	value: string | string[];
}>;

export type APISchema = {
	title: string;
	description: string;
	props?: Props;
	dataAttributes?: DataAttributes;
};

export type KeyboardSchema = Array<{
	key: string;
	behavior: string;
}>;
