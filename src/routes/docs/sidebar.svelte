<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '../helpers';

	const sections = {
		overview: ['introduction'],
		builders: ['accordion', 'collapsible'],
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
	class="flex w-full flex-col gap-8 overflow-y-auto py-8 pr-4 xl:sticky xl:top-14 xl:h-[calc(100vh-3.5rem)]"
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
								'hover:bg-casablanca-600/25',
								'data-[active=true]:border-casablanca-600 data-[active=true]:bg-casablanca-600/25'
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
