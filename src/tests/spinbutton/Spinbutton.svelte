<script lang="ts">
	import { createSpinButton, melt } from '$lib';

	export let minValue = 1
	export let maxValue = 10

	const {
		elements: { root, label, value, spinbutton, increase, decrease },
    states: { currentValue }
	} = createSpinButton({
		minValue,
		maxValue,
	});
</script>

<!-- NOTE: this example is from the WARIA website -->
<div use:melt={$root} data-testid="spinbutton-root">
	<div use:melt={$label} data-testid="spinbutton-label">Pick a number:</div>
	<div
		use:melt={$spinbutton}
		data-testid="spinbutton"
		class="spinbutton"
		aria-label="Font size in points"
	>
		<span class="value" data-testid="spinbutton-value" use:melt={$value}>{currentValue}pt</span>
		<span use:melt={$increase} data-testid="spinbutton-increase" class="increase">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
				<polygon class="increase" fill="#333" points="0,12 11,12 6,2" />
			</svg>
		</span>
		<span use:melt={$decrease} data-testid="spinbutton-decrease" class="decrease">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
				<polygon class="decrease" fill="#333" points="0,2 11,2 6,12" />
			</svg>
		</span>
	</div>
</div>
