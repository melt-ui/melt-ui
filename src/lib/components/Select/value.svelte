<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';
	import { getSelectRootContext } from './root.svelte';
	export type SelectValueProps = BaseProps<'span'> & {
		placeholder?: string;
	};
</script>

<script lang="ts">
	type $$Props = SelectValueProps;
	export let use: $$Props['use'] = [];
	export let placeholder: $$Props['placeholder'] = '';

	const rootCtx = getSelectRootContext();
</script>

<span {...$$restProps} use:useActions={use ?? []}>
	{$rootCtx.value ?? placeholder}
</span>
