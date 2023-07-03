<script lang="ts" context="module">
	export const isMenuOpen = writable(false);
</script>

<script lang="ts">
	import '../app.postcss';
	import GitHub from '~icons/simple-icons/github';
	import Discord from '~icons/simple-icons/discord';
	import Book from '~icons/lucide/book';
	import Menu from '~icons/lucide/menu';
	import X from '~icons/lucide/x';
	import { cn } from '$routes/helpers';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import TailwindIndicator from './(components)/tailwind-indicator.svelte';
	import { dev } from '$app/environment';
	import { SiteHeader } from '$docs/components';
</script>

<div class="relative flex min-h-screen flex-col" id="page">
	<SiteHeader />
	<div class="flex flex-1 flex-col py-2">
		<slot />
	</div>
	{#if dev}
		<TailwindIndicator />
	{/if}
</div>
