<script lang="ts">
	import Tree from './tree.svelte';

	import { createTableOfContents } from '@melt-ui/svelte';

	const { activeHeadingIdxs, headingsTree, item } = createTableOfContents({
		selector: '#toc-builder-preview',
		exclude: ['h1', 'h4', 'h5', 'h6'],
		activeType: 'lowest-parents',
		// scrollOffset: 20,
		// scrollBehaviour: 'smooth',
		headingFilterFn: (heading) => !heading.hasAttribute('data-toc-ignore'),
		scrollFn: (id) => {
			/**
			 * Here we're overwriting the default scroll function
			 * so that we only scroll within the ToC preview
			 * container, instead of the entire page.
			 */
			const container = document.getElementById('toc-builder-preview');
			const element = document.getElementById(id);

			if (container && element) {
				container.scrollTo({
					top: element.offsetTop - container.offsetTop,
					behavior: 'smooth',
				});
			}
		},
	});
</script>

<div class="relative mx-8 w-full">
	<!-- Contents -->
	<div id="toc-builder-preview">
		<h2>First Heading</h2>
		<p>This is the first heading.</p>
		<h3>Sub-Heading Example</h3>
		<p>This is a sub-heading H3 example.</p>
		<h4>This H4 is excluded</h4>
		<p>
			H4 headings were added to the list of excluded heading tags, so this will
			not show up in the table of contents.
		</p>
		<h2 data-toc-ignore>This H2 gets ignored</h2>
		<p>
			You can adjust the filter function to show or hide headings based on
			specific requirements. Check the code for an example.
		</p>
		<h2>Accessible by Design</h2>
		<p>
			Melt UI puts accessibility front and center, making sure your UI
			components are inclusive and user-friendly. We follow WAI-ARIA design
			patternsand take care of all the nitty-gritty details like aria
			attributes, role management, focus handling, and keyboard navigation. Each
			builder's page includes a section on accessibility, with references to
			relevant WAI-ARIA guidelines & instructions for using the builder in an
			accessible manner.
		</p>
		<h2>Bring Your Own Styles</h2>
		<p>
			The builders ship with zero predefined styles, allowing you to customize
			them to seamlessly integrate with your application's design system.
			Whether you prefer vanilla CSS, CSS preprocessors, or CSS-in-JS libraries,
			our components work harmoniously with your preferred styling solution.
		</p>
		<h2>Open & Extensible</h2>
		<p>
			Melt UI embraces your desire for customization. The builder architecture
			is open and flexible, allowing you to tinker with every aspect of the
			components. Wrap them, extend their functionality, or add event listener
			and props to tailor them to your exact needs.
		</p>
	</div>

	<!-- Table of Contents -->
	<div class="absolute right-0 top-0 overflow-visible">
		<div class="space-y-2 rounded-lg bg-neutral-900 px-4 py-2">
			<p class="font-medium">On This Page</p>
			<nav>
				<Tree
					tree={$headingsTree}
					activeHeadingIdxs={$activeHeadingIdxs}
					{item}
				/>
			</nav>
		</div>
	</div>
</div>

<style>
	#toc-builder-preview {
		@apply h-60 w-1/2 space-y-4 overflow-y-scroll rounded-lg bg-neutral-900 px-4 py-2;
	}

	#toc-builder-preview > h2 {
		@apply text-xl font-bold;
	}

	#toc-builder-preview > h3 {
		@apply text-lg font-bold;
	}

	#toc-builder-preview > h4 {
		@apply text-lg font-semibold;
	}
</style>
