<script lang="ts">
	import { Bird } from 'lucide-svelte';
	import Tree from './tree.svelte';
	import { createTableOfContents } from '$lib/index.js';

	const {
		elements: { item },
		states: { activeHeadingIdxs, headingsTree },
	} = createTableOfContents({
		selector: '#toc-builder-preview',
		exclude: ['h1', 'h4', 'h5', 'h6'],
		activeType: 'all',
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
					top: element.offsetTop - container.offsetTop - 16,
					behavior: 'smooth',
				});
			}
		},
	});

	let hideHeading = false;
</script>

<div
	class="grid h-[18rem] grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"
>
	<div
		id="toc-builder-preview"
		class="space-y-2 overflow-y-auto rounded-lg bg-white p-4 text-neutral-900"
	>
		<button on:click={() => (hideHeading = !hideHeading)} class="hide-heading">
			{hideHeading ? 'Show heading' : 'Hide heading'}
		</button>

		{#if !hideHeading}
			<h2>First Heading</h2>
			<p>This is the first heading.</p>

			<h3>Sub-Heading</h3>
			<p>This is a sub-heading H3 example.</p>
		{/if}
		<h4>This H4 is excluded</h4>
		<p>
			H4 headings were added to the list of excluded heading tags, so this will
			not show up in the table of contents.
		</p>
		<h2 class="inline-flex items-center justify-center gap-2">
			<Bird />
			Icon heading
		</h2>
		<p>Here we have a heading with an icon.</p>
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

	<div class="overflow-y-auto rounded-lg bg-white p-4">
		<p class="font-semibold text-neutral-900">On This Page</p>
		<nav>
			{#key $headingsTree}
				<Tree
					tree={$headingsTree}
					activeHeadingIdxs={$activeHeadingIdxs}
					{item}
				/>
			{/key}
		</nav>
	</div>
</div>

<style lang="postcss">
	#toc-builder-preview > h2 {
		@apply text-xl font-bold;
	}

	#toc-builder-preview > h3 {
		@apply text-lg font-bold;
	}

	#toc-builder-preview > h4 {
		@apply text-lg font-semibold;
	}

	.hide-heading {
		display: inline-flex;
		height: theme(spacing.8);
		cursor: default;
		align-items: center;
		justify-content: center;
		border-radius: theme(borderRadius.md);
		background-color: theme(colors.magnum.200);
		padding-inline: theme(spacing.4);
		line-height: 1;
		font-weight: theme(fontWeight.semibold);
		color: theme(colors.magnum.900);
		@apply transition;

		&:hover {
			opacity: 0.75;
		}
	}
</style>
