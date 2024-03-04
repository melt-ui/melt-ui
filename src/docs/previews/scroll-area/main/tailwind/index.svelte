<script lang="ts">
	import { createScrollArea, melt } from '$lib/index.js';
	import { flavors } from './flavors.js';

	const {
		elements: {
			root,
			content,
			viewport,
			corner,
			scrollbarY,
			thumbY,
			thumbX,
			scrollbarX,
		},
	} = createScrollArea({
		type: 'hover',
		dir: 'ltr',
	});
</script>

<div
	use:melt={$root}
	class="relative h-72 w-52 overflow-hidden rounded-md border bg-white text-magnum-900 shadow-lg"
>
	<div use:melt={$viewport} class="h-full w-full rounded-[inherit]">
		<div use:melt={$content}>
			<div class="p-4">
				<h4 class="mb-4 font-semibold leading-none">Endless Flavors</h4>
				{#each flavors as flavor (flavor)}
					<div class="text-sm">
						{flavor}
					</div>
					<div role="separator" class="my-2 h-px w-full bg-magnum-600" />
				{/each}
			</div>
		</div>
	</div>
	<div
		use:melt={$scrollbarY}
		class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-magnum-800/10 p-px transition-colors"
	>
		<div
			use:melt={$thumbY}
			class="relative flex-1 rounded-full bg-magnum-600"
		/>
	</div>
	<div
		use:melt={$scrollbarX}
		class="flex h-2.5 w-full touch-none select-none border-t border-t-transparent bg-magnum-800/10 p-px"
	>
		<div use:melt={$thumbX} class="relative rounded-full bg-magnum-600" />
	</div>
	<div use:melt={$corner} />
</div>
