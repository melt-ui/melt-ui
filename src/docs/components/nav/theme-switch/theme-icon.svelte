<script lang="ts">
	import { Monitor, Moon, Sun } from 'lucide-svelte';
	import type { Theme } from './types';

	export let theme: Theme = 'dark';

	const classes = 'h-5 w-5';
</script>

{#if theme === 'dark'}
	<Moon class={classes} />
{:else if theme === 'light'}
	<Sun class={classes} />
{:else}
	<Monitor class={classes} />
{/if}
