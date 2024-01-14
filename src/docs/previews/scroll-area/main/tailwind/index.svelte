<script lang="ts">
	import { createScrollArea, melt } from '$lib/index.js';

	const {
		elements: { root, content, viewport, corner },
		builders: { createScrollbar },
	} = createScrollArea({
		type: 'always',
		dir: 'ltr',
	});

	const {
		elements: { scrollbar, thumb },
	} = createScrollbar('vertical');

	const tags = Array.from({ length: 50 }).map(
		(_, i, a) => `v.0.9.0-beta.${a.length - i}`,
	);
</script>

<div
	use:melt={$root}
	class="relative h-72 w-48 overflow-hidden rounded-md border bg-white text-magnum-900 shadow-lg"
>
	<div use:melt={$viewport} class="h-full w-full rounded-[inherit]">
		<div use:melt={$content}>
			<div class="p-4">
				<h4 class="mb-4 text-sm font-semibold leading-none">Tags</h4>
				{#each tags as tag (tag)}
					<div class="text-sm">
						{tag}
					</div>
					<div role="separator" class="my-2 h-px w-full bg-magnum-600" />
				{/each}
			</div>
		</div>
	</div>
	<div
		use:melt={$scrollbar}
		class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-magnum-800/10 p-px transition-colors"
	>
		<div use:melt={$thumb} class="relative flex-1 rounded-full bg-magnum-600" />
	</div>
	<div use:melt={$corner} />
</div>
