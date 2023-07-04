<!-- MDsveX Layout Component -->
<script context="module">
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
	} from '$docs/components/markdown';

	export { a, blockquote, h1, h2, h3, h4, h5, h6, hr, img, li, ol, p, pre, ul };
</script>

<script lang="ts">
	// export let title = "";
	// export let description = "";
	// export let source = "";
	// export let component = "";
	// export let radix = "";
</script>

<slot />
