<script lang="ts">
	import { createScrollArea, melt } from '$lib/index.js';
	import { flavors } from './flavors.js';

	const {
		elements: { root, content, viewport, corner, scrollbarY, thumbY },
	} = createScrollArea({
		type: 'auto',
		dir: 'ltr',
	});

	const {
		elements: {
			root: rootA,
			content: contentA,
			viewport: viewportA,
			corner: cornerA,
			scrollbarY: scrollbarYA,
			thumbY: thumbYA,
		},
	} = createScrollArea({
		type: 'auto',
		dir: 'ltr',
	});

	let height = 288;
</script>

<div class="flex items-center gap-4">
	<div
		use:melt={$rootA}
		class="relative h-72 w-56 overflow-hidden rounded-md border border-neutral-700 bg-neutral-800/90 p-3 text-white shadow-lg"
	>
		<div use:melt={$viewportA} class="h-full w-full rounded-[inherit]">
			<div use:melt={$contentA}>
				<div class="p-4">
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
			use:melt={$scrollbarYA}
			class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-neutral-300/10 p-px transition-colors"
		>
			<div
				use:melt={$thumbYA}
				class="relative flex-1 rounded-full bg-neutral-300/50"
			/>
		</div>
		<div use:melt={$cornerA} />
	</div>

	<div
		use:melt={$root}
		class="relative h-72 w-56 overflow-hidden rounded-md border border-neutral-700 bg-neutral-800/90 p-3 text-white shadow-lg"
		style:height="{height}px"
	>
		<div use:melt={$viewport} class="h-full w-full rounded-[inherit]">
			<div use:melt={$content}>
				<div class="p-4">
					<h4 class="mb-4 font-semibold leading-none">A Few Flavors</h4>
					{#each flavors.slice(0, 5) as flavor (flavor)}
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
</div>
