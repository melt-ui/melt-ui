<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$docs/utils';
	import { navConfig } from '$docs/config';
</script>

<nav class="flex w-full flex-col gap-4">
	{#each navConfig.sidebarNav as navItem, index (index)}
		<div>
			<span
				class="text-md block whitespace-nowrap rounded-md border border-transparent px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400"
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
										'block whitespace-nowrap rounded-md border border-transparent px-3 py-2 font-medium capitalize',
										'hover:bg-magnum-600/25',
										'data-[active=true]:border-magnum-600 data-[active=true]:bg-magnum-600/25'
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
