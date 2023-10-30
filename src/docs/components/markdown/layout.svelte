<!-- MDsveX Layout Component -->
<script context="module" lang="ts">
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

<style lang="scss" global>
	.mdsvex code:not(pre > code) {
	--at-apply:  relative rounded-md bg-magnum-900/50 px-[0.25rem] py-[0.15rem] font-mono text-[0.75rem] text-xs font-semibold leading-7 text-magnum-300;
}

.mdsvex code.neutral {
	--at-apply:  bg-neutral-700/50 text-neutral-50;
}

[data-theme='default'] {
	display: flex;
	flex-direction: column;
}

[data-rehype-pretty-code-fragment] [data-line-numbers] > [data-line]::before {
	--at-apply:  text-xs text-neutral-400/40;
	counter-increment: line;
	content: counter(line);
	display: inline-block;
	width: 1.8rem;
	margin-right: 1.4rem;
	text-align: right;
}

[data-metadata] [data-code-copy] {
	--at-apply:  top-16 !important;
}

[data-rehype-pretty-code-fragment] {
	--at-apply:  relative;

	& pre {
		--at-apply:  mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border-x border-b border-neutral-500/50 bg-neutral-950/60 py-4 text-xs font-semibold lg:text-sm;
	}

	& code {
		--at-apply:  grid min-w-full break-words rounded-none border-0 bg-transparent p-0;
		counter-reset: line;
		box-decoration-break: clone;
	}

	& [data-line] {
		--at-apply:  inline-block w-full basis-4 border-l-[3px] border-l-transparent py-0.5 pl-2 pr-5;
	}

	& [data-highlighted-line] {
		--at-apply:  border-l-magnum-300 bg-magnum-500/[0.1];
	}

	& [data-chars-id] {
		--at-apply:  pb-0.5 shadow-none;
	}
}

[data-comp-preview] [data-rehype-pretty-code-fragment] {
	& pre {
		--at-apply:  mt-0 rounded-b-lg rounded-t-none;
	}
}

[data-chars-id='ul'] {
	--at-apply:  border-b border-b-magnum-500 font-bold !important;
}

[data-chars-id='hi'] {
	--at-apply:  rounded bg-magnum-500/[0.1] p-1 font-bold !important;
}

[data-chars-id='r'] {
	--at-apply:  border-b-magnum-600 font-bold !important;
}

[data-chars-id='t'] {
	--at-apply:  border-b-magnum-600 font-bold !important;
}

[data-chars-id='c'] {
	--at-apply:  border-b-magnum-600 font-bold !important;
}

[data-rehype-pretty-code-title] {
	--at-apply:  mt-2 px-4 pt-6 text-sm font-medium;
}

[data-rehype-pretty-code-title] + pre {
	--at-apply:  mt-2;
}

[data-callout] > p:last-child {
	--at-apply:  mb-0 !important;
}

[data-comp-preview] + p {
	--at-apply:  mt-6;
}

[data-metadata]:not(:has(pre)) {
	display: none;
}

</style>
