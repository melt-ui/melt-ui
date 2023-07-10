<script lang="ts">
	import { createDialog } from '$lib/builders';
	import { flyAndScale } from '$docs/utils';
	import X from '~icons/lucide/x';
	import { CodeBlock } from '$docs/components';

	const { trigger, portal, overlay, content, title, close, open } = createDialog({});

	export let name = '';
	export let code = '';

	$: console.log(name);
</script>

<button
	{...$trigger}
	use:trigger
	class="relative inline rounded-md bg-neutral-700/50 px-[0.25rem] py-[0.15rem] font-mono text-[0.75rem] text-xs font-semibold text-neutral-50 underline underline-offset-4 transition-all hover:underline-offset-[6px]"
	aria-label="Open type dialog"
>
	{name}
</button>
<div use:portal>
	{#if $open}
		<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[960px]
    translate-x-[-50%] translate-y-[-50%] rounded-md
    bg-neutral-800 p-4 shadow-lg md:p-8"
			transition:flyAndScale={{
				duration: 150,
				y: 8,
				start: 0.96,
			}}
			{...$content}
			use:content
		>
			<div class="mb-2">
				<code class="inline-code !text-xl" {...$title}>{name}</code>
			</div>
			<div class="relative">
				<CodeBlock class="rounded-md bg-neutral-900" copyBtnClasses="top-4 right-4">
					{@html code}
				</CodeBlock>
			</div>
			<button
				{...$close}
				use:close
				class="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px]
                appearance-none items-center justify-center rounded-full text-magnum-300
                hover:bg-magnum-800/50 focus:shadow-magnum-400"
			>
				<X />
			</button>
		</div>
	{/if}
</div>
