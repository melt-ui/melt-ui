<script lang="ts">
	import { createMenubar, melt, type CreateMenubarMenuProps } from '$lib/index.js';

	type $$Props = CreateMenubarMenuProps & { setRootClickOutsideBehaviorIgnore: () => void };
	export let setRootClickOutsideBehaviorIgnore: () => void;

	const {
		elements: { menubar },
		builders: { createMenu },
	} = createMenubar();

	const {
		elements: { trigger, menu },
		states: { open },
	} = createMenu({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<div use:melt={$menubar}>
	<button use:melt={$trigger} data-testid="menubar-trigger">trigger</button>
	{#if $open}
		<div use:melt={$menu} data-testid="menubar-content">
			<button
				data-testid="menubar-set-parent-click-outside-behavior-ignore"
				on:click={setRootClickOutsideBehaviorIgnore}
			>
				set root clickOutsideBehavior: ignore
			</button>
		</div>
	{/if}
</div>
