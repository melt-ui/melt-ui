<script lang="ts">
	import { createSpinButton, melt } from '$lib';

	export let defaultValue = '';
	export let steps = 4;
	export let disabled = false;

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	const {
		elements: { root, label, content, increaseTrigger, decreaseTrigger },
		states: { value },
	} = createSpinButton({
		steps,
		defaultValue,
		values: months,
		disabled,
	});
</script>

<!-- NOTE: this example is from the WARIA website -->
<div use:melt={$root} data-testid="spinbutton-root">
	<div use:melt={$label} data-testid="spinbutton-label">Pick a month:</div>
	<span use:melt={$increaseTrigger} data-testid="spinbutton-increase" class="increase">
		<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
			<polygon class="increase" fill="#333" points="0,12 11,12 6,2" />
		</svg>
	</span>

	<div use:melt={$content} data-testid="spinbutton" class="spinbutton">
		{$value}
	</div>

	<span use:melt={$decreaseTrigger} data-testid="spinbutton-decrease" class="decrease">
		<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
			<polygon class="decrease" fill="#333" points="0,2 11,2 6,12" />
		</svg>
	</span>
</div>
