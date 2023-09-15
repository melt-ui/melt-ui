<script lang="ts">
	import DatePicker from './date-picker.svelte';
</script>

<div class="flex gap-4">
	<DatePicker activeDate={new Date(1979, 8)} numberOfMonths={2} />
	<DatePicker mode="multiple" activeDate={new Date(1985, 11)} />
	<DatePicker mode="range" activeDate={new Date(2023, 9)} />
</div>
