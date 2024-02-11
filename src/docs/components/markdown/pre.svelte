<script lang="ts">
	import { cn, createCopyCodeButton } from '$docs/utils/index.js';
	import { getUsingPreprocessor } from '$routes/store.js';
	import { fly } from 'svelte/transition';
	import { Check, Copy } from '$icons/index.js';

	let className: string | undefined | null = undefined;
	export { className as class };

	const usingPreprocessor = getUsingPreprocessor();

	const { copied, copyCode, setCodeString } = createCopyCodeButton();

	let isPPBlock: boolean | undefined = undefined;
	const setIsPPBlock = (node: HTMLElement) => {
		isPPBlock = node.dataset.nonPp === undefined;
	};

	$: show =
		isPPBlock === undefined ||
		(isPPBlock && $usingPreprocessor) ||
		(!isPPBlock && !$usingPreprocessor);
</script>

{#if show}
	<!-- svelte-ignore a11y-no-noninteractive-tabindex -- This is needed to be acessible -->
	<pre
		use:setCodeString
		use:setIsPPBlock
		class={cn(
			'force-dark mb-4 mt-6 max-h-[650px] overflow-x-auto !rounded-xl border !border-neutral-700/50 !bg-neutral-800 py-4 dark:!bg-neutral-800/50',
			isPPBlock === undefined && 'data-[non-pp]:hidden',
			className
		)}
		tabindex="0"
		{...$$restProps}>
    <slot />
	</pre>
	{#if isPPBlock !== undefined}
		<button
			class="absolute right-4 top-4 z-10"
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
	{/if}
{/if}

<style>
	/* Override theme colors for WCAG concerns */
	pre :global([style*='color: #6A737D']) {
		color: #727e8b !important;
	}

	pre {
		font-weight: initial;
	}
</style>
