<script lang="ts">
	import { Progress, type ProgressRootProps } from '..';

	export let max: ProgressRootProps['max'] = 1;
	export let value: ProgressRootProps['value'] = 0;
</script>

<Progress.Root aria-label="basic progress" {max} {value}>
	<Progress.Indicator data-testid={'progress-indicator'}>X</Progress.Indicator>
</Progress.Root>
