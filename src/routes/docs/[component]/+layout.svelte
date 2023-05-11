<script lang="ts">
	import theme from 'svelte-highlight/styles/tomorrow-night';
	import { page } from '$app/stores';
	import { schemas } from '$routes/(previews)/schemas';
	import { cn, sortedEntries } from '$routes/helpers';

	type Link = {
		title: string;
		href: string;
	};

	let links: Link[] = sortedEntries(schemas).map(([key, schema]) => ({
		title: schema.title,
		href: `/docs/${key}`,
	}));
</script>

<svelte:head>
	{@html theme}
</svelte:head>

<div class="flex max-w-full flex-col gap-8 py-2 lg:flex-row lg:px-6 lg:py-6">
	<div class="w-auto min-w-[256px] lg:max-w-sm">
		<ul class="flex w-full overflow-x-auto p-2 lg:flex-col">
			{#each links as link}
				<li>
					<a
						class={cn(
							'block whitespace-nowrap rounded-md border border-transparent px-3 py-2',
							'hover:bg-vermilion-600/25',
							'data-[active=true]:border-vermilion-600 data-[active=true]:bg-vermilion-600/25'
						)}
						data-active={$page.url.pathname === link.href}
						href={link.href}>{link.title}</a
					>
				</li>
			{/each}
		</ul>
	</div>
	<div class="flex w-full justify-center overflow-y-auto">
		<div class="w-full max-w-7xl items-center px-4 pt-2">
			<div class="w-full">
				<slot />
			</div>
		</div>
	</div>
</div>
