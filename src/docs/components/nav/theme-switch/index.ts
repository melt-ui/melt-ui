import { browser } from '$app/environment';
import { readable, writable } from 'svelte/store';
import type { Theme } from './types';

export { default } from './theme-switch.svelte';

function createThemeStore() {
	if (browser) {
		const { subscribe, set } = writable((localStorage.theme as Theme) || 'dark');

		return {
			subscribe,
			set: (theme: Theme) => {
				localStorage.theme = theme;
				set(theme);
			},
		};
	}
	return readable<Theme>('dark');
}

export const theme = createThemeStore();
