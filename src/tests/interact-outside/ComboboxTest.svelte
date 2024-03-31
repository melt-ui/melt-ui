<script lang="ts">
	import { createCombobox, melt, type CreateComboboxProps } from '$lib/index.js';

	type $$Props = CreateComboboxProps;

	const {
		elements: { input, menu },
		states: { open },
	} = createCombobox({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<input use:melt={$input} data-testid="combobox-trigger" />
{#if $open}
	<div use:melt={$menu} data-testid="combobox-content" />
{/if}
