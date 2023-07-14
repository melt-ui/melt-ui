<script lang="ts">
	import Tree from './tree.svelte';

	import { createTableOfContents } from '@melt-ui/svelte';

	const { activeHeadingIdxs, headingsTree } = createTableOfContents({
		selector: '#mdsvex',
		exclude: ['h1', 'h4', 'h5', 'h6'],
		tocType: 'lowest-parents',
	});
</script>

<div class="space-y-2">
	<p class="font-medium">On This Page</p>
	<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} />
</div>
