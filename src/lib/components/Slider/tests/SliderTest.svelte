<script lang="ts">
	import { Slider } from '$lib';

	export let value = [0];
</script>

<form>
	<Slider.Root {value}>
		<Slider.Track>
			<Slider.Range />
		</Slider.Track>
		<Slider.Thumb aria-label="slider-test" />
	</Slider.Root>
</form>
