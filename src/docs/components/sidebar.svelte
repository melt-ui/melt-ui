<script lang="ts">
	import { page } from '$app/stores';
	import { cn, formatStr } from '$docs/utils';

	const buildersGlob = import.meta.glob('./builders/**/+page.svelte');
	const builders = Object.keys(buildersGlob)
		.map((path) => path.split('/')[2])
		.sort();

	const sections = {
		overview: ['introduction', 'getting-started'],
		builders,
	};
</script>

<ul class="flex w-full flex-col gap-4">
	{#each Object.entries(sections) as [section, routes]}
		<li>
			<span
				class="text-md block whitespace-nowrap rounded-md border border-transparent px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
			>
				{formatStr(section)}
			</span>
			<ul class="grid grid-flow-row auto-rows-max">
				{#each routes as route}
					{@const href = `/docs/${section}/${route}`}
					<li class="px-1">
						<a
							{href}
							class={cn(
								'block whitespace-nowrap rounded-md border border-transparent px-3 py-2 font-medium capitalize',
								'hover:bg-magnum-600/25',
								'data-[active=true]:border-magnum-600 data-[active=true]:bg-magnum-600/25'
							)}
							data-active={$page.url.pathname === href}
						>
							{formatStr(route)}
						</a>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
