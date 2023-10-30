<script lang="ts">
	import { Check, Copy } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { cn, createCopyCodeButton } from '$docs/utils/index.js';

	const { copied, setCodeString, copyCode } = createCopyCodeButton();

	export let copyBtnClasses = '';

	const preTabIndex = (node: HTMLElement) => {
		const pre = node.querySelector('pre');
		if (pre) {
			pre.tabIndex = 0;
		}
	};
</script>

<div use:setCodeString {...$$restProps} data-rehype-pretty-code-fragment use:preTabIndex>
	<slot />
</div>
<button
	class={cn('absolute right-4 top-12 z-10', copyBtnClasses)}
	aria-label="copy"
	on:click={copyCode}
	data-code-copy
>
	{#if $copied}
		<div in:fly={{ y: -4 }}>
			<Check class=" text-magnum-500 square-4" />
		</div>
	{:else}
		<div in:fly={{ y: 4 }}>
			<Copy class=" square-4 hover:text-magnum-500" />
		</div>
	{/if}
</button>

<style lang="postcss">
	[data-rehype-pretty-code-fragment] :global(pre) {
		font-weight: initial !important;
		--_apply: border-neutral-700/50 bg-neutral-800/50;
	}
</style>
