<script lang="ts">
	import { createLinkPreview, melt } from '$lib/index.js';
	import { fly } from 'svelte/transition';

	const {
		elements: { trigger, content, arrow },
		states: { open },
	} = createLinkPreview({
		forceVisible: true,
	});
</script>

<a
	class="trigger"
	href="https://github.com/melt-ui/melt-ui"
	target="_blank"
	rel="noopener noreferrer"
	use:melt={$trigger}
>
	<img
		src="/logo_mark.svg"
		alt="Melt UI Logo"
		class="h-full w-full rounded-full bg-neutral-900 object-contain p-1"
	/>
	<span class="sr-only">Open Melt UI Details</span>
</a>

{#if $open}
	<div
		use:melt={$content}
		transition:fly={{ y: -5, duration: 100 }}
		class="z-10 rounded-md bg-white shadow-sm"
	>
		<div class="w-[300px] rounded-md bg-white p-5 shadow-sm">
			<div class="flex flex-col gap-2">
				<img
					src="/logo_mark.svg"
					alt="Melt UI Logo"
					class="object-fit block h-14 w-14 rounded-full bg-neutral-900 p-1"
				/>
				<div class="flex flex-col gap-4">
					<div>
						<div class="font-bold text-neutral-900">Melt UI</div>
						<div class="text-neutral-400">melt-ui/melt-ui</div>
					</div>
				</div>
				<div class="m-0 text-neutral-700">
					A set of accessible, unstyled component builders for Svelte &
					SvelteKit. Open source.
				</div>
				<div class="flex gap-4">
					<div class="flex gap-1">
						<div class="text-neutral-900">2k</div>
						<div class="text-neutral-400">Stars</div>
					</div>
					<div class="flex gap-1">
						<div class="text-neutral-900">103</div>
						<div class="text-neutral-400">Forks</div>
					</div>
				</div>
			</div>
		</div>
		<div use:melt={$arrow} />
	</div>
{/if}

<style lang="scss">
	.trigger {
		@apply flex h-12 w-12 items-center justify-center;
		@apply rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
</style>
