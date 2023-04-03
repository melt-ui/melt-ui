<script lang="ts">
	import { getState, getSwitchContext } from './root.svelte';

	const { checked, disabled } = getSwitchContext();
</script>

<span
	class={$$props.class}
	data-state={getState($checked)}
	data-disabled={$disabled ? '' : undefined}
/>
