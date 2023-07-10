<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';
	import { cn, createCopyCodeButton } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };

	const { copied, copyCode, setCodeString } = createCopyCodeButton();
</script>

<pre
	use:setCodeString
	class={cn(
		'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border border-neutral-500/50 bg-neutral-950/60 py-4 font-bold',
		className
	)}
	{...$$restProps}>
    <slot />
</pre>
<button class="absolute right-3 top-3 z-10" aria-label="copy" on:click={copyCode} data-code-copy>
	{#if $copied}
		<div in:fly={{ y: -4 }}>
			<Check class="text-magnum-500" />
		</div>
	{:else}
		<div in:fly={{ y: 4 }}>
			<Copy class="hover:text-magnum-500" />
		</div>
	{/if}
</button>
