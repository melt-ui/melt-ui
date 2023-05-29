<script lang="ts" context="module">
	export type CollapsibleTriggerProps = BaseProps;
</script>

<script lang="ts">
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';
	import { getCollapsibleRootContext } from './root.svelte';

	type $$Props = CollapsibleTriggerProps;

	const ctx = getCollapsibleRootContext();
	$: trigger = $ctx?.trigger ?? {};
</script>

<button {...$$restProps} {...$trigger} use:useActions={$$restProps.use} type="button">
	<slot />
</button>
