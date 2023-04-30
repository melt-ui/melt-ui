<script lang="ts">
	import { RadioGroup } from '../index';
</script>

<RadioGroup.Root aria-label="View density">
	<RadioGroup.Item value="default" id="r1">
		<RadioGroup.Indicator />
	</RadioGroup.Item>
	<label for="r1"> Default </label>

	<RadioGroup.Item value="comfortable" id="r2">
		<RadioGroup.Indicator />
	</RadioGroup.Item>
	<label for="r2"> Comfortable </label>

	<RadioGroup.Item value="compact" id="r3">
		<RadioGroup.Indicator />
	</RadioGroup.Item>
	<label for="r3"> Compact </label>
</RadioGroup.Root>
