<script lang="ts">
	import Tree from './tree.svelte';

	import { createTableOfContents } from '@melt-ui/svelte';

	const { activeHeadingIdxs, headingsTree, item } = createTableOfContents({
		selector: '#mdsvex',
		exclude: ['h1', 'h4', 'h5', 'h6'],
		activeType: 'lowest-parents',
		scrollOffset: 80,
		scrollBehaviour: 'smooth',
	});
</script>

<div class="space-y-2 py-2 px-8 rounded-lg bg-neutral-900">
	<p class="font-medium">On This Page</p>
	<nav>
		<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} />
	</nav>
</div>
