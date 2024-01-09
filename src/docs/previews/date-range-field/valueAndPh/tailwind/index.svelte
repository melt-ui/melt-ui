<script lang="ts">
	import { parseDateTime } from '@internationalized/date';
	import DateRangeField from './DateRangeField.svelte';

	const availability = {
		start: parseDateTime('2021-10-11T00:00:00'),
		end: parseDateTime('2021-10-15T00:00:00'),
	};
</script>

<div>
	<DateRangeField />
	<DateRangeField defaultValue={availability} />
</div>

<style lang="postcss">
	div {
		@apply flex flex-col gap-6;
	}
</style>
