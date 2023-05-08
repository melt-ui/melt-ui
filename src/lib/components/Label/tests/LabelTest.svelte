<script lang="ts">
	import { Label } from '$lib/components/Label';
	import { labelDataTestId, inputId, labelText } from './constants';

	type MouseDownEvent = MouseEvent & {
		currentTarget: EventTarget & HTMLLabelElement;
	};
	export let onMouseDown: (event: MouseDownEvent) => void;
</script>

<Label.Root data-testid={labelDataTestId} aria-label="basic label" {onMouseDown} for={inputId}
	>{labelText}</Label.Root
>
<input type="text" id={inputId} />
