import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export const isMountedStore = () => {
	const mounted = writable(false);
	onMount(() => {
		mounted.set(true);
		return () => {
			mounted.set(false);
		};
	});

	return mounted;
};
