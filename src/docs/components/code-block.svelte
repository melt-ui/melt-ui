<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cn, createCopyCodeButton } from '$docs/utils/index.js';
	import { Check, Copy } from '$icons/index.js';

	const { copied, setCodeString, copyCode } = createCopyCodeButton();

	export let copyBtnClasses = '';

	const preTabIndex = (node: HTMLElement) => {
		const pre = node.querySelector('pre');
		if (pre) {
			pre.tabIndex = 0;
		}
	};
</script>

<figure
	use:setCodeString
	class={cn($$restProps.class, 'force-dark')}
	{...$$restProps}
	data-rehype-pretty-code-figure
	use:preTabIndex
>
	<slot />
</figure>
<button
	class={cn('force-dark absolute right-4 top-12 z-10 text-white', copyBtnClasses)}
	aria-label="copy"
	on:click={copyCode}
	data-code-copy
>
	{#if $copied}
		<div in:fly={{ y: -4 }}>
			<Check class="size-4 text-magnum-500" />
		</div>
	{:else}
		<div in:fly={{ y: 4 }}>
			<Copy class="size-4 hover:text-magnum-500" />
		</div>
	{/if}
</button>

<style lang="postcss">
	[data-rehype-pretty-code-figure] :global(pre) {
		font-weight: initial !important;
		@apply border-neutral-700 bg-neutral-800 pl-2 !important;
	}

	:global(:root.dark) {
		[data-rehype-pretty-code-figure] :global(pre) {
			@apply border-neutral-700/50 bg-neutral-800/50 pl-2 !important;
		}
	}
</style>
