<script lang="ts">
	import { createScrollArea, melt } from '$lib/index.js';
	import { flavors } from './flavors.js';

	const {
		elements: { root, content, viewport, corner, scrollbarY, thumbY },
	} = createScrollArea({
		type: 'hover',
		dir: 'ltr',
	});
</script>

<div
	use:melt={$root}
	class="relative h-72 w-56 overflow-hidden rounded-md border border-neutral-700 bg-neutral-800/90 text-white shadow-lg"
>
	<div use:melt={$viewport} class="h-full w-full rounded-[inherit]">
		<div use:melt={$content}>
			<div class="p-7">
				<h4 class="mb-4 font-semibold leading-none">Endless Flavors</h4>
				{#each flavors as flavor (flavor)}
					<div class="text-sm">
						{flavor}
					</div>
					<div role="separator" class="my-2 h-px w-full bg-magnum-800/30" />
				{/each}
			</div>
		</div>
	</div>
	<div
		use:melt={$scrollbarY}
		class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-neutral-300/10 p-px transition-colors"
	>
		<div
			use:melt={$thumbY}
			class="relative flex-1 rounded-full bg-neutral-300/50"
		/>
	</div>
	<div use:melt={$corner} />
</div>
