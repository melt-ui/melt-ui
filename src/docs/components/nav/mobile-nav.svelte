<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';
	import { fade, fly } from 'svelte/transition';
	import Menu from '~icons/lucide/menu';
	import X from '~icons/lucide/x';
	import { Button, MobileNavLink } from '$docs/components';
	import { navConfig } from '$docs/config';

	const { trigger, portal, overlay, content, close, open } = createDialog();
</script>

<button
	{...$trigger}
	use:trigger
	class="ml-6 text-neutral-400 transition-colors hover:text-neutral-50 md:hidden"
>
	<Menu class="h-6 w-6" />
	<span class="sr-only">Toggle Menu</span>
</button>
<div use:portal>
	{#if $open}
		<div
			{...$overlay}
			class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
			transition:fade={{ duration: 150 }}
		/>
		<div
			{...$content}
			use:content
			class="menu fixed left-0 top-0 z-50 h-screen w-5/6 bg-neutral-900 p-[25px]
				 shadow-lg focus:outline-none"
			transition:fly={{ x: -768, duration: 300, opacity: 1 }}
		>
			<MobileNavLink href="/" {open}>
				<img src="/logo.svg" alt="Melt UI" class="h-9" />
			</MobileNavLink>

			<div class="my-4 h-[calc(100vh-8rem)] overflow-auto overflow-x-visible px-4 py-2 pb-10">
				<div class="flex flex-col">
					{#each navConfig.mainNav as navItem, index (navItem + index.toString())}
						{#if navItem.href}
							<MobileNavLink href={navItem.href} {open}>
								{navItem.title}
							</MobileNavLink>
						{/if}
					{/each}
				</div>
				<div class="flex flex-col space-y-2">
					{#each navConfig.sidebarNav as navItem, index (index)}
						<div class="flex flex-col pt-6">
							<span
								class="rounded-md px-3 pb-2 text-sm font-semibold uppercase tracking-wider text-neutral-400"
								>{navItem.title}</span
							>
							{#if navItem?.items?.length}
								{#each navItem.items as item}
									{#if !item.disabled && item.href}
										<MobileNavLink href={item.href} {open}>
											{item.title}</MobileNavLink
										>
									{/if}
								{/each}
							{/if}
						</div>
					{/each}
				</div>
			</div>
			<Button
				class="absolute right-4 top-4 px-2"
				size="sm"
				variant="ghost"
				{...$close}
				action={close}
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	{/if}
</div>

<style lang="postcss">
	.menu {
		@apply ring-0 !important;
	}
</style>
