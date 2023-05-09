<script context="module">
	export const testConstants = {
		labelDataTestId: 'label',
		inputId: 'input-id',
	};
</script>

<script lang="ts">
	import { Label } from '$lib/components/Label';
</script>

<Label.Root
	data-testid={testConstants.labelDataTestId}
	aria-label="basic label"
	for={testConstants.inputId}>Label text</Label.Root
>
<input type="text" id={testConstants.inputId} />
