<script lang="ts">
	import { writable } from 'svelte/store';
	import Slider from './slider.svelte';

	const value1 = writable([30, 40, 50, 60, 70]);
	const value2 = writable([30, 40, 50, 60, 70]);
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-4 text-center">
		<code>enableSwap: false; value: {$value1}</code>
		<Slider value={value1} />
	</div>
	<div class="flex flex-col gap-4 text-center">
		<code>enableSwap: true; value: {$value2}</code>
		<Slider value={value2} enableSwap={true} />
	</div>
</div>
