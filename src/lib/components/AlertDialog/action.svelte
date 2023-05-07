<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	export type AlertDialogActionProps = BaseProps<'div'>;
</script>

<script lang="ts">
	type $$Props = AlertDialogActionProps;
	export let use: $$Props['use'] = [];
</script>

<div {...$$restProps} use:useActions={use ?? []}>
	<slot />
</div>