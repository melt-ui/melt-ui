<script lang="ts">
	import { RadioGroup } from '../index';
</script>

<RadioGroup.Root aria-label="View density">
	<RadioGroup.Item value="default" id="r1" aria-labelledby="r1-label">
		<RadioGroup.Indicator />
	</RadioGroup.Item>
	<label for="r1" id="r1-label"> Default </label>

	<RadioGroup.Item value="comfortable" id="r2" aria-labelledby="r2-label">
		<RadioGroup.Indicator />
	</RadioGroup.Item>
	<label for="r2" id="r2-label"> Comfortable </label>
</RadioGroup.Root>
