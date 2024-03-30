<script lang="ts">
	import { createMenubar, melt, type CreateMenubarProps } from '$lib/index.js';

	type $$Props = CreateMenubarProps;

	const {
		elements: { menubar },
		builders: { createMenu },
	} = createMenubar($$restProps);

	const {
		elements: { trigger, menu },
		states: { open },
	} = createMenu({ ...$$restProps, forceVisible: true });
</script>

<div use:melt={$menubar}>
	<button use:melt={$trigger} data-testid="menubar-trigger">trigger</button>
	{#if $open}
		<div use:melt={$menu} data-testid="menubar-content" />
	{/if}
</div>
