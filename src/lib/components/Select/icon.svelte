<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	export type SelectIconProps = BaseProps<'div'>;
</script>

<script lang="ts">
	type $$Props = SelectIconProps;
	export let use: $$Props['use'] = [];
</script>

<span aria-hidden {...$$restProps} use:useActions={use ?? []}>
	<slot>▼</slot>
</span>
