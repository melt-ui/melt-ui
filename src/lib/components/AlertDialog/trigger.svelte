<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	export type AlertDialogTriggerProps = BaseProps<'div'>;
</script>

<script lang="ts">
	type $$Props = AlertDialogTriggerProps;
	export let use: $$Props['use'] = [];
</script>

<div {...$$restProps} use:useActions={use ?? []}>
	<slot />
</div>