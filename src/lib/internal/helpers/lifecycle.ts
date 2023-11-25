import { onDestroy, onMount } from 'svelte';

export const safeOnMount = (fn: (...args: unknown[]) => unknown) => {
	try {
		onMount(fn);
	} catch {
		return fn();
	}
};

export const safeOnDestroy = (fn: (...args: unknown[]) => unknown) => {
	try {
		onDestroy(fn);
	} catch {
		return fn();
	}
};
