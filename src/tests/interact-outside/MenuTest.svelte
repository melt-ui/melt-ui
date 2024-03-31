<script lang="ts">
	import { createDropdownMenu, melt, type CreateDropdownMenuProps } from '$lib/index.js';

	type $$Props = CreateDropdownMenuProps;

	const {
		elements: { trigger, menu },
		states: { open },
	} = createDropdownMenu({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<button use:melt={$trigger} data-testid="menu-trigger">trigger</button>
{#if $open}
	<div use:melt={$menu} data-testid="menu-content" />
{/if}
