<script lang="ts">
	import DateRangeField from './DateRangeField.svelte';
</script>

<div>
	<DateRangeField locale="en-US" />
	<DateRangeField locale="en-UK" />
	<DateRangeField locale="de" />
	<DateRangeField locale="fr" />
</div>

<style lang="postcss">
	div {
		@apply flex flex-col gap-6;
	}
</style>
