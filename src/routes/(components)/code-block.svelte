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
		'code-block relative rounded-lg',
		'border border-neutral-300/30',
		inline ? 'inline-block overflow-hidden pr-12' : 'my-2'
	)}
>
	<button class="absolute right-3 top-3 z-10" aria-label="copy" on:click={copyCode}>
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
	<div
		class={cn(
			'max-h-[17rem] lg:max-h-[25rem]',
			inline ? 'inline-block overflow-hidden' : 'overflow-auto'
		)}
	>
		<HighlightSvelte {code} class="text-sm" />
	</div>
</div>

<style>
	.code-block {
		background: theme('colors.neutral.900/0.9');
	}

	.code-block :global(.hljs) {
		background: transparent !important;
		overflow: unset !important;
	}
</style>
