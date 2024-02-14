<script lang="ts">
	import { createStepper, melt } from '$lib/index.js';
	import ChevronUpIcon from 'lucide-svelte/icons/chevron-up';
	import ChevronDownIcon from 'lucide-svelte/icons/chevron-down';

	const {
		elements: { stepper, incrementButton, decrementButton },
		states: { value, previous, next },
	} = createStepper({
		defaultValue: 1,
		min: 1,
		max: 12,
	});

	const monthMap = {
		1: 'January',
		2: 'February',
		3: 'March',
		4: 'April',
		5: 'May',
		6: 'June',
		7: 'July',
		8: 'August',
		9: 'September',
		10: 'October',
		11: 'November',
		12: 'December',
	};

	type Month = keyof typeof monthMap;

	$: month = monthMap[$value as Month];
	$: previousMonth = $previous ? monthMap[$previous as Month] : '';
	$: nextMonth = $next ? monthMap[$next as Month] : '';
</script>

<p id="month-label" class="font-semibold text-magnum-900">Month</p>
<div
	use:melt={$stepper}
	aria-labelledby="month-label"
	aria-valuetext={month}
	class="
		mt-1 flex w-32 flex-col items-center gap-3 rounded-md bg-magnum-900
		focus-visible:!outline focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-magnum-900
	"
>
	<button
		use:melt={$decrementButton}
		class="flex h-10 w-full items-center justify-center border-b-2 border-magnum-400 text-magnum-400 disabled:text-opacity-[0.38]"
	>
		<ChevronUpIcon />
	</button>
	<p class="h-6 text-center text-base font-medium text-white/[0.38]">
		{previousMonth}
	</p>
	<p class="h-6 text-center text-base font-medium">
		{month}
	</p>
	<p class="h-6 text-center text-base font-medium text-white/[0.38]">
		{nextMonth}
	</p>
	<button
		use:melt={$incrementButton}
		class="flex h-10 w-full items-center justify-center border-t-2 border-magnum-400 text-magnum-400 disabled:text-opacity-[0.38]"
	>
		<ChevronDownIcon />
	</button>
</div>
