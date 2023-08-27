<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';
	import { flyAndScale } from '$docs/utils/index.js';
	import { X } from 'lucide-svelte';
	import { CodeBlock } from '$docs/components/index.js';

	const {
		elements: { trigger, overlay, content, title, close },
		states: { open },
	} = createDialog();

	export let name = '';
	export let code = '';
</script>

<button
	use:melt={$trigger}
	class="relative inline rounded-md bg-neutral-700/50 px-[0.25rem] py-[0.15rem] font-mono text-[0.75rem] text-xs font-semibold text-neutral-50 underline underline-offset-4 transition-all hover:underline-offset-[6px]"
	aria-label="Open type dialog"
>
	{name}
</button>
{#if $open}
	<div use:melt={$overlay} class="fixed inset-0 z-40 bg-black/50" />
	<div
		class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[960px]
    translate-x-[-50%] translate-y-[-50%] rounded-md
    bg-neutral-800 p-4 shadow-lg md:p-8"
		transition:flyAndScale={{
			duration: 150,
			y: 8,
			start: 0.96,
		}}
		use:melt={$content}
	>
		<div class="mb-2">
			<code class="inline-code !text-xl" use:melt={$title}>{name}</code>
		</div>
		<div class="relative">
			<CodeBlock class="rounded-md bg-neutral-900" copyBtnClasses="top-4 right-4">
				{@html code}
			</CodeBlock>
		</div>
		<button
			use:melt={$close}
			aria-label="Close"
			class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-magnum-300
                hover:bg-magnum-800/50 focus:shadow-magnum-400"
		>
			<X class="square-4" />
		</button>
	</div>
{/if}
