<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { schemas } from '$routes/(previews)/schemas';
	import { cn, sortedEntries } from '$routes/helpers';
	import theme from 'svelte-highlight/styles/tomorrow-night';
	import { isMenuOpen } from '$routes/+layout.svelte';

	type Link = {
		title: string;
		href: string;
	};

	let links: Link[] = sortedEntries(schemas).map(([key, schema]) => ({
		title: schema.title,
		href: `/docs/${key}`,
	}));

	afterNavigate(() => {
		$isMenuOpen = false;
	});
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<div class="flex max-w-full grid-cols-12 flex-col gap-8 py-2 xl:grid xl:px-6 xl:py-6">
	<div
		class={cn(
			$isMenuOpen ? 'block' : 'hidden xl:block',
			'z-10 col-span-2 w-full xl:w-auto xl:max-w-xs'
		)}
	>
		<ul class="flex w-full flex-col p-2">
			<li
				class="text-md block whitespace-nowrap rounded-md border border-transparent px-3 py-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
			>
				Components
			</li>
			{#each links as link}
				<li>
					<a
						class={cn(
							'block whitespace-nowrap rounded-md border border-transparent px-3 py-2',
							'hover:bg-vermilion-600/25',
							'data-[active=true]:border-vermilion-600 data-[active=true]:bg-vermilion-600/25'
						)}
						data-active={$page.url.pathname === link.href}
						href={link.href}
					>
						{link.title}
					</a>
				</li>
			{/each}
		</ul>
	</div>
	<div
		class={cn(
			$isMenuOpen ? 'hidden xl:flex' : 'flex',
			`col-span-8 w-full justify-center overflow-y-auto`
		)}
	>
		<div class="w-full max-w-7xl items-center px-4 pt-2">
			<div class="w-full">
				<slot />
			</div>
		</div>
	</div>
	<div class="col-span-2" />
</div>
