<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '../helpers';

	const buildersGlob = import.meta.glob('./builders/**/+page.svelte');
	const builders = Object.keys(buildersGlob)
		.map((path) => path.split('/')[2])
		.sort();

	const sections = {
		overview: ['introduction', 'getting-started'],
		builders,
	};

	const format = (s: string) => {
		// Capitalize and remove dashes
		return s
			.split('-')
			.map((word) => word[0].toUpperCase() + word.slice(1))
			.join(' ');
	};
</script>

<ul
	class="flex w-full flex-col gap-8 overflow-y-auto px-4 py-8 xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)]"
>
	{#each Object.entries(sections) as [section, routes]}
		<li>
			<span
				class="text-md block whitespace-nowrap rounded-md border border-transparent px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
			>
				{format(section)}
			</span>
			<ul>
				{#each routes as route}
					{@const href = `/docs/${section}/${route}`}
					<li>
						<a
							{href}
							class={cn(
								'block whitespace-nowrap rounded-md border border-transparent px-3 py-2 capitalize',
								'hover:bg-magnum-600/25',
								'data-[active=true]:border-magnum-600 data-[active=true]:bg-magnum-600/25'
							)}
							data-active={$page.url.pathname === href}
						>
							{format(route)}
						</a>
					</li>
				{/each}
			</ul>
		</li>
	{/each}
</ul>
