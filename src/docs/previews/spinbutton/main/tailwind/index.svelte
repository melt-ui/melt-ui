<script lang="ts">
	import { createSpinButton, melt } from '$lib/index.js';
	import { ArrowDown, ArrowUp } from 'lucide-svelte';

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
		values: months,
	});
</script>

<div use:melt={$root} class="flex items-center gap-4">
	<div use:melt={$label} class="font-medium text-magnum-900">
		Select a month:
	</div>
	<div class="flex flex-col items-center gap-4">
		<button
			type="button"
			use:melt={$increaseTrigger}
			aria-label="Increase the value"
		>
			<ArrowUp class="h-6 w-6 text-magnum-700" />
		</button>
		<div
			use:melt={$content}
			class="min-w-[120px] rounded-md bg-white px-3 py-2 text-center text-magnum-700 focus:ring focus:ring-magnum-900"
		>
			{$value}
		</div>
		<button
			type="button"
			use:melt={$decreaseTrigger}
			aria-label="Decrease the value"
		>
			<ArrowDown class="h-6 w-6 text-magnum-700" />
		</button>
	</div>
</div>
