<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { isMenuOpen } from '$routes/+layout.svelte';
	import { cn, formatStr } from '$routes/helpers';
	import theme from 'svelte-highlight/styles/atom-one-dark';
	import Sidebar from './sidebar.svelte';
	import { page } from '$app/stores';

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
	class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10"
>
	<aside
		class={cn(
			'fixed top-14 z-30 -ml-2 h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r border-r-neutral-400/60 md:sticky md:block',
			$isMenuOpen ? 'block' : 'hidden '
		)}
	>
		<div class="py-6 pr-6 lg:py-8">
			<div class={cn('z-20 ')}>
				<Sidebar />
			</div>
		</div>
	</aside>
	<main
		class={cn(
			'relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]',
			$isMenuOpen ? 'hidden xl:grid' : 'flex flex-shrink flex-grow overflow-y-auto'
		)}
	>
		<div class="mx-auto w-full min-w-0">
			<slot />
		</div>
	</main>
</div>
