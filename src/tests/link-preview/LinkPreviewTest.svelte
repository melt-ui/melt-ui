<script lang="ts">
	import { createLinkPreview, melt } from '$lib/index.js';

	const {
		elements: { trigger, content, arrow },
	} = createLinkPreview({
		openDelay: 0,
	});
</script>

<a
	data-testid="trigger"
	class="trigger"
	href="https://github.com/melt-ui/melt-ui"
	target="_blank"
	rel="noopener noreferrer"
	use:melt={$trigger}
>
	<img
		src="/logo_mark.svg"
		alt="Melt UI Logo"
		class="h-full w-full rounded-full bg-neutral-900 object-contain p-2"
	/>
	<span class="sr-only">Open Melt UI Details</span>
</a>

<div use:melt={$content} class="z-10 rounded-md bg-white shadow-sm" data-testid="content">
	<div class="w-[300px] rounded-md bg-white p-5 shadow-sm">
		<div class="flex flex-col gap-2">
			<img
				src="/logo_mark.svg"
				alt="Melt UI Logo"
				class="object-fit block h-14 w-14 rounded-full bg-neutral-900 p-2"
			/>
			<div class="flex flex-col gap-4">
				<div>
					<div class="font-bold text-neutral-900">Melt UI</div>
					<div class="text-neutral-400">melt-ui/melt-ui</div>
				</div>
			</div>
			<div class="m-0 text-neutral-700" data-testid="highlight">
				A set of accessible, unstyled component builders for Svelte & SvelteKit. Open source.
			</div>
			<div class="flex gap-4">
				<div class="flex gap-1">
					<div class="text-neutral-900">618</div>
					<div class="text-neutral-400">Stars</div>
				</div>
				<div class="flex gap-1">
					<div class="text-neutral-900">37</div>
					<div class="text-neutral-400">Forks</div>
				</div>
			</div>
		</div>
	</div>
	<div use:melt={$arrow} data-testid="arrow" />
</div>
<div data-testid="start" />

<style lang="postcss">
	.trigger {
		@apply flex h-12 w-12 items-center justify-center;
		@apply rounded-full bg-white p-0 text-sm font-medium;
		@apply text-magnum-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}
</style>
