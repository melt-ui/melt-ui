<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	import type { CheckboxItemEvents, CheckboxItemProps } from '../types.js';

	type $$Props = CheckboxItemProps;
	type $$Events = CheckboxItemEvents;
	export let checked: $$Props['checked'] = undefined;
	export let onCheckedChange: $$Props['onCheckedChange'] = undefined;
	export let disabled: $$Props['disabled'] = undefined;
	export let asChild: $$Props['asChild'] = false;

	const {
		elements: { checkboxItem },
		states: { checked: localChecked },
		updateOption,
	} = ctx.setCheckboxItem({
		disabled,
		defaultChecked: checked,
		onCheckedChange: ({ next }) => {
			onCheckedChange?.(next);
			checked = next;
			return next;
		},
	});

	$: checked !== undefined && localChecked.set(checked);
	$: updateOption('disabled', disabled);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions / applied by melt's builder-->

{#if asChild}
	<slot builder={$checkboxItem} />
{:else}
	<div
		use:melt={$checkboxItem}
		{...$$restProps}
		on:m-click
		on:m-focusin
		on:m-focusout
		on:m-keydown
		on:m-pointerdown
		on:m-pointerleave
		on:m-pointermove
	>
		<slot builder={$checkboxItem} />
	</div>
{/if}
