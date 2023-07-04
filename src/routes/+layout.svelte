<script lang="ts" context="module">
	export const isMenuOpen = writable(false);
</script>

<script lang="ts">
	import '../app.postcss';
	import { writable } from 'svelte/store';
	import TailwindIndicator from './(components)/tailwind-indicator.svelte';
	import { dev } from '$app/environment';
	import { SiteHeader } from '$docs/components';
</script>

<div class="relative flex min-h-screen flex-col" id="page">
	<SiteHeader />
	<div class="flex flex-1">
		<slot />
	</div>
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
