<script lang="ts">
	import DateField from './DateField.svelte';
	import { now, getLocalTimeZone } from '@internationalized/date';

	const withLocalTimeZone = now(getLocalTimeZone());
	const withLosAngelesTimeZone = now('America/Los_Angeles');
</script>

<div class="flex flex-col gap-8">
	<DateField defaultPlaceholder={withLocalTimeZone} />
	<DateField defaultPlaceholder={withLosAngelesTimeZone} />
</div>
