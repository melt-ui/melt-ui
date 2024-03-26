<script lang="ts">
	import { writable } from 'svelte/store';
	import Slider from './slider.svelte';

	const value1 = writable([30, 40, 50, 60, 70]);
	const value2 = writable([30, 40, 50, 60, 70]);
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-4 text-center">
		<code>disableSwap: true; value: {$value1}</code>
		<Slider value={value1} disableSwap={true} />
	</div>
	<div class="flex flex-col gap-4 text-center">
		<code>disableSwap: false; value: {$value2}</code>
		<Slider value={value2} />
	</div>
</div>
