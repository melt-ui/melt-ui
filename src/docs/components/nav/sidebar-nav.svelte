<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$docs/utils/index.js';
	import { navConfig } from '$docs/config.js';
</script>

<nav class="flex w-full flex-col gap-4">
	{#each navConfig.sidebarNav as navItem, index (index)}
		<div>
			<span
				class="block whitespace-nowrap rounded-lg border border-transparent px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
			>
				{navItem.title}
			</span>
			<div class="grid grid-flow-row auto-rows-max">
				{#if navItem?.items?.length}
					{#each navItem.items as item}
						{#if !item.disabled && item.href}
							<div class="px-1">
								<a
									href={item.href}
									class={cn(
										'block whitespace-nowrap rounded-lg border-2 border-transparent px-2.5 py-1.5 font-medium capitalize',
										'text-sm hover:bg-magnum-900/25',
										'data-[active=true]:border-magnum-400 data-[active=true]:bg-magnum-900/50'
									)}
									data-active={$page.url.pathname === item.href}
								>
									{item.title}
								</a>
							</div>
						{/if}
					{/each}
				{/if}
			</div>
		</div>
	{/each}
</nav>
