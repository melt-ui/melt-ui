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

export type LongType = {
	rawCode: string;
	highlightedCode?: string;
};

export type Prop = {
	name: string;
	type: string | string[];
	default?: string;
	required?: boolean;
	description?: string;
	longType?: LongType;
	/**
	 * A reference link to more information about the prop.
	 */
	see?: {
		label: string;
		href: string;
	};
};

export type Props = Prop[];

export type Events = Array<{
	label: string;
	payload?: unknown;
}>;

export type DataAttributes = Array<{
	name: string;
	value: string;
}>;

export type CustomEvents = Array<{
	name: string;
	description: string;
}>;

export type ReturnedProps = Array<{
	name: string;
	type?: string;
	description?: string;
	link?: string;
	longType?: LongType;
}>;

export type APISchema = {
	title: string;
	description: string;
	isBuilder?: boolean;
	props?: Props;
	dataAttributes?: DataAttributes;
	customEvents?: CustomEvents;
	elements?: ReturnedProps;
	helpers?: ReturnedProps;
	states?: ReturnedProps;
	builders?: ReturnedProps;
	actions?: ReturnedProps;
	options?: ReturnedProps;
	returnedProps?: ReturnedProps;
};

export type KeyboardSchema = Array<{
	key: string;
	behavior: string;
}>;
