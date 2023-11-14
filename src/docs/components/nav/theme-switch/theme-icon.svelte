<script lang="ts">
	import { Monitor, Moon, Sun } from 'lucide-svelte';
	import type { Theme } from './types';

	export let theme: Theme;

	$: component = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
</script>

<svelte:component this={component} class="h-5 w-5" />
