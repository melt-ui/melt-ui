import type { Writable } from 'svelte/store';

export type CreateNavigationMenuProps = {
	defaultValue?: string;
	value?: Writable<string>;
};
