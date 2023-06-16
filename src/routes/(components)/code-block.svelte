<script lang="ts">
	import Check from '~icons/lucide/check';
	import Copy from '~icons/lucide/copy';
	import { fly } from 'svelte/transition';
	import { HighlightSvelte } from 'svelte-highlight';
	import { cn } from '$routes/helpers';

	export let code: string;
	export let collapsible = true;
	export let inline = false;

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

	$: collapsed = !showCode && collapsible;
</script>

<div
	class={cn(
		'code-block relative overflow-hidden rounded-lg',
		collapsed ? 'max-h-36 overflow-hidden' : 'max-h-[auto] overflow-auto',
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
	<div
		class={cn(
			'absolute bg-gradient-to-t from-zinc-900/90 to-magnum-900/30',
			collapsed ? 'inset-0' : 'inset-x-0 bottom-0'
		)}
	>
		{#if collapsible}
			<div class="absolute inset-x-0 bottom-3 flex justify-center">
				<button
					class="rounded-lg border border-magnum-600/20 bg-zinc-900 px-4 py-1 text-sm hover:border-magnum-600/70"
					on:click={() => (showCode = !showCode)}
				>
					{showCode ? 'Collapse code' : 'Expand code'}
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.code-block {
		background: theme('colors.zinc.800/0.75');
	}

	.code-block :global(.hljs) {
		background: transparent !important;
	}
</style>
