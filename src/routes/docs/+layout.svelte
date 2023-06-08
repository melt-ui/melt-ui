<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { schemas } from '$routes/(previews)/schemas';
	import { cn, sortedEntries } from '$routes/helpers';
	import theme from 'svelte-highlight/styles/tomorrow-night';
	import { isMenuOpen } from '$routes/+layout.svelte';

	export let data;

	afterNavigate(() => {
		$isMenuOpen = false;
	});
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<div class="flex max-w-full flex-col gap-8 xl:flex-row xl:px-6">
	<div
		class={cn(
			'z-10 flex-shrink-0 flex-grow basis-[min(20vw,250px)] xl:w-auto xl:max-w-xs',
			$isMenuOpen ? 'block' : 'hidden xl:block'
		)}
	>
		<ul
			class="flex w-full flex-col overflow-y-auto py-8
			pl-2 pr-4 xl:sticky xl:top-14 xl:h-[calc(100vh-3.5rem)]"
		>
			<li
				class="text-md block whitespace-nowrap rounded-md border border-transparent px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
			>
				Components
			</li>
			{#each data.components as link}
				<li>
					<a
						class={cn(
							'block whitespace-nowrap rounded-md border border-transparent px-3 py-2 capitalize',
							'hover:bg-vermilion-600/25',
							'data-[active=true]:border-vermilion-600 data-[active=true]:bg-vermilion-600/25'
						)}
						data-active={$page.url.pathname === link.href}
						href={link.href}
					>
						{link.name}
					</a>
				</li>
			{/each}
		</ul>
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
	<div class="flex-shrink-0 flex-grow basis-[min(20vw,250px)]" />
</div>
