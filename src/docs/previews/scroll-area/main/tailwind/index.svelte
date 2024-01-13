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
		(_, i, a) => `v.1.2.0-beta.${a.length - i}`,
	);
</script>

<div
	use:melt={$root}
	class="relative h-72 w-48 overflow-hidden rounded-md border"
>
	<div use:melt={$viewport} class="h-full w-full rounded-[inherit]">
		<div use:melt={$content}>
			<div class="p-4">
				<h4 class="mb-4 text-sm font-medium leading-none">Tags</h4>
				{#each tags as tag (tag)}
					<div class="text-sm">
						{tag}
					</div>
					<div role="separator" class="my-2 h-px w-full bg-green-500" />
				{/each}
			</div>
		</div>
	</div>
	<div
		use:melt={$scrollbar}
		class="flex h-full w-2.5 touch-none select-none border-l border-l-transparent bg-gray-500 p-px transition-colors"
	>
		<div use:melt={$thumb} class="relative flex-1 rounded-full bg-green-500" />
	</div>
	<div use:melt={$corner} />
</div>
