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

<div class="flex max-w-full flex-col gap-8 xl:grid xl:grid-cols-[250px,1fr,250px] xl:px-6">
	<div class={cn('z-10 ', $isMenuOpen ? 'block' : 'hidden xl:block')}>
		<Sidebar />
	</div>
	<div
		class={cn(
			`flex-shrink flex-grow justify-center overflow-y-auto`,
			$isMenuOpen ? 'hidden xl:flex' : 'flex'
		)}
	>
		<div class="w-full max-w-7xl items-center px-4 py-8">
			<div class="w-full">
				<slot />
			</div>
		</div>
	</div>
	<div class="" />
</div>
