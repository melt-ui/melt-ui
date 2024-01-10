<!-- MDsveX Layout Component -->
<script context="module" lang="ts">
	import '../../../markdown.postcss';
	import {
		a,
		blockquote,
		h1,
		h2,
		h3,
		h4,
		h5,
		h6,
		hr,
		img,
		li,
		ol,
		p,
		pre,
		ul,
	} from '$docs/components/markdown/index.js';
	export { a, blockquote, h1, h2, h3, h4, h5, h6, hr, img, li, ol, p, pre, ul };
</script>

<script>
	// this gets rid of warnings in the console that the layout was created with unknown props
	// feels weird but we can't use TS in this mdsvex layout component (from my understanding)
	export let snippets = '';
	export let schemas = '';
	export let previews = '';
	export let keyboard = '';
	export let title = '';
	export let description = '';
</script>

<slot {snippets} {schemas} {previews} {keyboard} {title} {description} />
