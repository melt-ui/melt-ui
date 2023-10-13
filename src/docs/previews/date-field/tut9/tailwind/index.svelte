<script lang="ts">
	import { CalendarDateTime } from '@internationalized/date';
	import DateField from './DateField.svelte';

	const defaultPlaceholder = new CalendarDateTime(2023, 10, 11, 12, 30);
</script>

<div>
	<DateField locale={'en-US'} {defaultPlaceholder} />
	<DateField locale={'de'} {defaultPlaceholder} />
	<DateField locale={'es'} {defaultPlaceholder} />
	<DateField locale={'uk'} {defaultPlaceholder} />
</div>

<style lang="postcss">
	div {
		@apply grid grid-cols-2 gap-12;
	}
</style>
