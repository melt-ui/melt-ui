<script lang="ts">
	import type { DayOfWeek } from '$lib';
	import DatePicker from './date-picker.svelte';

	const disabledDaysOfWeek: DayOfWeek['daysOfWeek'][number][] = [3, 4, 5];
</script>

<div class="flex gap-4">
	<DatePicker disabled={new Date()} />
	<DatePicker mode="multiple" />
	<DatePicker mode="range" disabled={{ daysOfWeek: disabledDaysOfWeek }} />
</div>
