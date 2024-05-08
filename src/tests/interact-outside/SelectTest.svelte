<script lang="ts">
	import { createSelect, melt, type CreateSelectProps } from '$lib/index.js';

	type $$Props = CreateSelectProps & { setRootInteractOutsideBehaviorIgnore: () => void };
	export let setRootInteractOutsideBehaviorIgnore: () => void;

	const {
		elements: { trigger, menu },
		states: { open },
	} = createSelect({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<button use:melt={$trigger} data-testid="select-trigger">trigger</button>
{#if $open}
	<div use:melt={$menu} data-testid="select-content">
		<button
			data-testid="select-set-parent-click-outside-behavior-ignore"
			on:click={setRootInteractOutsideBehaviorIgnore}
		>
			set root interactOutsideBehavior: ignore
		</button>
	</div>
{/if}
