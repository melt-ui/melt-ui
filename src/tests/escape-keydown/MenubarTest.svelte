<script lang="ts">
	import { createMenubar, melt, type CreateMenubarMenuProps } from '$lib/index.js';

	type $$Props = CreateMenubarMenuProps;
	export let escapeBehavior: CreateMenubarMenuProps['escapeBehavior'] = 'close';

	const {
		elements: { menubar },
		builders: { createMenu },
	} = createMenubar({ escapeBehavior });

	const {
		elements: { trigger, menu },
		states: { open },
	} = createMenu({ ...$$restProps, escapeBehavior, forceVisible: true });
</script>

<div use:melt={$menubar}>
	<button use:melt={$trigger} data-testid="menubar-trigger">trigger</button>
	{#if $open}
		<div use:melt={$menu} data-testid="menubar-content" />
	{/if}
</div>
