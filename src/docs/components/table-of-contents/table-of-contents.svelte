<script lang="ts">
	import Tree from './tree.svelte';

	import { createTableOfContents } from '$lib';

	/**
	 * The filter function is for removing headings from the ToC
	 * docs page where we have a preview with lots of headings.
	 */
	const {
		elements: { item },
		states: { activeHeadingIdxs, headingsTree },
	} = createTableOfContents({
		selector: '#mdsvex',
		exclude: ['h1', 'h4', 'h5', 'h6'],
		activeType: 'all',
		scrollOffset: 80,
		scrollBehaviour: 'smooth',
		headingFilterFn: (heading) =>
			heading.parentElement !== null &&
			heading.parentElement.id !== 'toc-builder-preview' &&
			!heading.parentElement.hasAttribute('data-melt-accordion-item'),
	});
</script>

<div class="space-y-2">
	<p class="font-medium">On This Page</p>
	<nav>
		<Tree tree={$headingsTree} activeHeadingIdxs={$activeHeadingIdxs} {item} />
	</nav>
</div>
