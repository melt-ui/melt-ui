<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';
	import { HighlightSvelte } from 'svelte-highlight';

	export let code: string;

	let showCode = false;

	let copied = false;
	let copytimeout: ReturnType<typeof setTimeout>;
	function copyCode() {
		navigator.clipboard.writeText(code);
		copied = true;
		clearTimeout(copytimeout);
		copytimeout = setTimeout(() => {
			copied = false;
		}, 2500);
	}
</script>

<div
	class="code-block relative mb-12 mt-2 overflow-hidden rounded-lg {showCode
		? 'max-h-[auto] overflow-auto'
		: 'max-h-36 overflow-hidden'}"
>
	<button class="absolute right-3 top-3 z-10" aria-label="copy" on:click={copyCode}>
		{#if copied}
			<div in:fly|local={{ y: -4 }}>
				<Check class="text-vermilion-500" />
			</div>
		{:else}
			<div in:fly|local={{ y: 4 }}>
				<Copy class="hover:text-vermilion-500" />
			</div>
		{/if}
	</button>
	<HighlightSvelte {code} class="text-sm" />
	<div
		class="absolute bg-gradient-to-t from-zinc-900/90 to-vermilion-900/30 {showCode
			? 'inset-x-0 bottom-0'
			: 'inset-0'}"
	>
		<div class="absolute inset-x-0 bottom-3 flex justify-center">
			<button
				class="rounded-lg border border-vermilion-600/20 bg-zinc-900 px-4 py-1 text-sm hover:border-vermilion-600/70"
				on:click={() => (showCode = !showCode)}
			>
				{showCode ? 'Collapse code' : 'Expand code'}
			</button>
		</div>
	</div>
</div>

<style>
	.code-block :global(.hljs) {
		background: theme('colors.zinc.800/0.5') !important;
	}
</style>
