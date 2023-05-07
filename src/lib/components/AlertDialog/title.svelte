<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	export type AlertDialogTitleProps = BaseProps<'div'>;
</script>

<script lang="ts">
	type $$Props = AlertDialogTitleProps;
	export let use: $$Props['use'] = [];
</script>

<div {...$$restProps} use:useActions={use ?? []}>
	<slot />
</div>