<script lang="ts">
	import { createPopover, melt, type CreatePopoverProps } from '$lib/index.js';

	type $$Props = CreatePopoverProps & { setRootInteractOutsideBehaviorIgnore: () => void };
	export let setRootInteractOutsideBehaviorIgnore: () => void;

	const {
		elements: { trigger, content },
		states: { open },
	} = createPopover({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<button use:melt={$trigger} data-testid="popover-trigger">trigger</button>
{#if $open}
	<div use:melt={$content} data-testid="popover-content">
		<button
			data-testid="popover-set-parent-click-outside-behavior-ignore"
			on:click={setRootInteractOutsideBehaviorIgnore}
		>
			set root interactOutsideBehavior: ignore
		</button>
	</div>
{/if}
