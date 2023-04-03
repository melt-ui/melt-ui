<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';
	import { getSwitchContext, getState } from './root.svelte';

	export type SwitchThumbProps = BaseProps<HTMLSpanElement>;
</script>

<script lang="ts">
	type $$Props = SwitchThumbProps;
	const { checked, disabled } = getSwitchContext();
</script>

<span {...$$restProps} data-state={getState($checked)} data-disabled={$disabled ? '' : undefined} />
