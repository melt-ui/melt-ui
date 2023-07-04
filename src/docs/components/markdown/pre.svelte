<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';
	import { cn } from '$docs/utils';

	let codeString: string;

	let className: string | undefined | null = undefined;
	export { className as class };

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;

	function copyCode() {
		navigator.clipboard.writeText(codeString);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}

	function copyCodeToClipboard(node: HTMLPreElement) {
		codeString = node.innerText.trim() ?? '';
	}
</script>

<pre
	use:copyCodeToClipboard
	class={cn(
		'mb-4 mt-6 max-h-[650px] overflow-x-auto rounded-lg border border-magnum-500/50 bg-neutral-950/50 py-4',
		className
	)}
	{...$$restProps}>
    <slot />
</pre>
<button class="absolute right-3 top-3 z-10" aria-label="copy" on:click={copyCode} data-code-copy>
	{#if copied}
		<div in:fly={{ y: -4 }}>
			<Check class="text-magnum-500" />
		</div>
	{:else}
		<div in:fly={{ y: 4 }}>
			<Copy class="hover:text-magnum-500" />
		</div>
	{/if}
</button>
