<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';
	import { HighlightSvelte } from 'svelte-highlight';
	import { cn } from '$routes/helpers';

	export let code: string;
	export let inline = false;

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
	class={cn(
		'code-block relative overflow-hidden rounded-lg',
		'max-h-[auto] overflow-auto',
		inline ? 'inline-block overflow-hidden pr-12' : 'my-2'
	)}
>
	<button class="absolute right-3 top-3 z-10" aria-label="copy" on:click={copyCode}>
		{#if copied}
			<div in:fly|local={{ y: -4 }}>
				<Check class="text-magnum-500" />
			</div>
		{:else}
			<div in:fly|local={{ y: 4 }}>
				<Copy class="hover:text-magnum-500" />
			</div>
		{/if}
	</button>
	<HighlightSvelte {code} class="text-sm" />
</div>

<style>
	.code-block {
		background: theme('colors.zinc.800/0.75');
	}

	.code-block :global(.hljs) {
		background: transparent !important;
	}
</style>
