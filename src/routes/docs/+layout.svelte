<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { isMenuOpen } from '$routes/+layout.svelte';
	import { cn, formatStr } from '$routes/helpers';
	import theme from 'svelte-highlight/styles/atom-one-dark';
	import Sidebar from './sidebar.svelte';
	import { page } from '$app/stores';
	import TableOfContents from '$routes/(components)/table-of-contents/table-of-contents.svelte';

	afterNavigate(() => {
		$isMenuOpen = false;
	});

	$: pageTitle = formatStr($page.url.pathname.split('/').pop() ?? '');
</script>

<svelte:head>
	<title>{pageTitle} - Melt UI</title>

	{@html theme}
</svelte:head>

<div
	class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:gap-10 xl:grid-cols-[240px_minmax(0,1fr)_240px]"
>
	<aside
		class={cn(
			'fixed top-[5rem] z-30 -ml-2 h-[calc(100vh-5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block',
			$isMenuOpen ? 'block' : 'hidden '
		)}
	>
		<div class="py-6 pr-12 md:pr-6 lg:py-8">
			<div class={cn('z-20 pb-24 md:pb-0')}>
				<Sidebar />
			</div>
		</div>
	</aside>
	<main
		class={cn(
			'relative py-6 lg:gap-10 lg:py-8',
			$isMenuOpen ? 'hidden xl:grid' : 'flex flex-shrink flex-grow'
		)}
	>
		<div class="mx-auto w-full min-w-0">
			<slot />
		</div>
	</main>

	<div
		class="sticky top-[5rem] -ml-2 hidden h-[calc(100vh-5rem)] overflow-y-auto py-8 pl-2 text-sm xl:block"
	>
		{#key $page.url.pathname}
			<TableOfContents />
		{/key}
	</div>
</div>
