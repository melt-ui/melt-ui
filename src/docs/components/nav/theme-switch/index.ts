import { browser } from '$app/environment';
import { derived, readable, writable } from 'svelte/store';
import type { Theme } from './types';

export { default } from './theme-switch.svelte';

function createThemeStore() {
	if (browser) {
		const { subscribe, set } = writable((localStorage.theme as Theme) || 'dark');

		return {
			subscribe,
			set: (theme: Theme) => {
				if (
					theme === 'dark' ||
					(theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
				) {
					document.documentElement.classList.add('dark');
				} else {
					document.documentElement.classList.remove('dark');
				}
				localStorage.theme = theme;
				set(theme);
			},
		};
	}
	return readable<Theme>('dark');
}

export const theme = createThemeStore();

export const darkMode = derived(theme, ($theme) => {
	if ($theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
	return $theme === 'dark';
});
