<script lang="ts">
	import Slider from './slider.svelte';
</script>

<div class="flex flex-col gap-8">
	<div class="flex flex-col gap-4 text-center">
		<code>enableSwap: false</code>
		<Slider />
	</div>
	<div class="flex flex-col gap-4 text-center">
		<code>enableSwap: true</code>
		<Slider enableSwap={true} />
	</div>
</div>
