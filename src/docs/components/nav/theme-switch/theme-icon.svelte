<script lang="ts">
	import { Monitor, Moon, Sun } from 'lucide-svelte';
	import type { Theme } from './types';

	export let theme: Theme = 'light';
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const sizeMap = {
		sm: 'h-3 w-3',
		md: 'h-5 w-5',
		lg: 'h-7 w-7',
	};

	$: component = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
</script>

<svelte:component this={component} class={sizeMap[size]} />
