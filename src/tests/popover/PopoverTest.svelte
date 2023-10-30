<script lang="ts">
	import { createPopover, melt, type CreatePopoverProps } from '$lib/index.js';
	import { Settings2, X } from 'lucide-svelte';

	export let openFocus: CreatePopoverProps['openFocus'] = undefined;
	export let closeFocus: CreatePopoverProps['closeFocus'] = undefined;
	type $$Props = CreatePopoverProps;

	const {
		elements: { trigger, content, arrow, close },
	} = createPopover({
		openFocus,
		closeFocus,
		...$$restProps,
	});
</script>

<button data-testid="closeFocus" id="closeFocus"> focus me on close </button>

<button
	type="button"
	class="trigger"
	use:melt={$trigger}
	aria-label="Update dimensions"
	data-testid="trigger"
>
	<Settings2 class="h-4 w-4" />
	<span class="sr-only">Open Popover</span>
</button>

<div use:melt={$content} class="content" data-testid="content">
	<div use:melt={$arrow} data-testid="arrow" />
	<div class="flex flex-col gap-2.5">
		<p>Dimensions</p>
		<fieldset>
			<label for="width">Width</label>
			<input type="number" id="width" class="input" placeholder="Width" data-testid="input1" />
		</fieldset>
		<fieldset>
			<label for="height">Height</label>
			<input type="number" id="height" class="input" placeholder="Height" data-testid="input2" />
		</fieldset>
		<fieldset>
			<label for="depth">Depth</label>
			<input type="number" id="depth" class="input" placeholder="Depth" data-testid="input3" />
		</fieldset>
		<fieldset>
			<label for="weight">Weight</label>
			<input type="number" id="weight" class="input" placeholder="Weight" data-testid="input4" />
		</fieldset>
	</div>
	<button class="close" use:melt={$close} data-testid="close">
		<X class="h-4 w-4 " />
	</button>
	<button data-testid="openFocus" id="openFocus"> focus me on open </button>
</div>
<div data-testid="outside" />

<style lang="scss">
	fieldset {
		--at-apply:  flex items-center gap-5;
	}

	label {
		--at-apply:  w-[75px] text-sm text-neutral-700;
	}

	p {
		--at-apply:  mb-2 font-medium text-neutral-900;
	}

	.input {
		--at-apply:  flex h-8 w-full rounded-md border border-magnum-800 bg-transparent px-2.5 text-sm;
		--at-apply:  ring-offset-magnum-300 focus-visible:ring;
		--at-apply:  focus-visible:ring-magnum-400 focus-visible:ring-offset-1;
		--at-apply:  flex-1 items-center justify-center;
		--at-apply:  px-2.5 text-sm leading-none text-magnum-700;
	}

	.trigger {
		--at-apply:  inline-flex h-9 w-9 items-center justify-center rounded-full bg-white p-0;
		--at-apply:  text-sm font-medium text-magnum-900 transition-colors hover:bg-white/90;
		--at-apply:  focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
	}

	.close {
		--at-apply:  absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full;
		--at-apply:  text-magnum-900 transition-colors hover:bg-magnum-500/10;
		--at-apply:  focus-visible:ring focus-visible:ring-magnum-400 focus-visible:ring-offset-2;
		--at-apply:  bg-white p-0 text-sm font-medium;
	}

	.content {
		--at-apply:  z-10 w-60 rounded-[4px] bg-white p-5 shadow-sm;
	}
</style>
