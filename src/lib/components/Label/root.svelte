<script lang="ts" context="module">
	import type { BaseProps } from '$lib/internal/types';

	type MouseDownEvent = MouseEvent & {
		currentTarget: EventTarget & HTMLLabelElement;
	};
	export type LabelRootProps = BaseProps<'label'> & {
		onMouseDown?: (event: MouseDownEvent) => void;
		ref?: HTMLLabelElement | undefined;
	};
</script>

<script lang="ts">
	type $$Props = LabelRootProps;

	export let onMouseDown: $$Props['onMouseDown'] = undefined;
	export let ref: $$Props['ref'] = undefined;
</script>

<label
	{...$$restProps}
	on:mousedown={(event) => {
		onMouseDown?.(event);
		// prevent text selection when double clicking label
		if (!event.defaultPrevented && event.detail > 1) {
			event.preventDefault();
		}
	}}
	bind:this={ref}
>
	<slot />
</label>
