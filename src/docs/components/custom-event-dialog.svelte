<script lang="ts">
	import { createDialog } from '$lib/builders';
	import { flyAndScale } from '$docs/utils';
	import { X } from 'lucide-svelte';
	import { CodeBlock } from '$docs/components';
	import customEventDetail from '$docs/data/long-types/custom-event-detail.html?raw';
	import { melt } from '@melt-ui/svelte';

	const {
		elements: { trigger, overlay, content, title, close },
		states: { open },
	} = createDialog();
</script>

<code class="neutral"
	>(e: <button
		use:melt={$trigger}
		class="text-magnum-500 underline underline-offset-[3px] transition-all hover:text-magnum-400 hover:underline-offset-4"
		>CustomEvent
	</button>) => void</code
>
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
			<code class="inline-code !text-xl" use:melt={$title}>CustomEventDetail</code>
		</div>
		<div class="relative">
			<CodeBlock class="rounded-md bg-neutral-900" copyBtnClasses="top-4 right-4">
				{@html customEventDetail}
			</CodeBlock>
		</div>
		<button
			use:melt={$close}
			aria-label="Close"
			class="absolute right-[10px] top-[10px] inline-flex h-6 w-6
                appearance-none items-center justify-center rounded-full text-magnum-300
                hover:bg-magnum-800/50 focus:shadow-magnum-400"
		>
			<X />
		</button>
	</div>
{/if}
