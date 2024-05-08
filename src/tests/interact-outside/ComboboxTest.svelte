<script lang="ts">
	import { createCombobox, melt, type CreateComboboxProps } from '$lib/index.js';

	type $$Props = CreateComboboxProps & { setRootInteractOutsideBehaviorIgnore: () => void };
	export let setRootInteractOutsideBehaviorIgnore: () => void;

	const {
		elements: { input, menu },
		states: { open },
	} = createCombobox({ ...$$restProps, forceVisible: true, portal: 'body' });
</script>

<input use:melt={$input} data-testid="combobox-trigger" />
{#if $open}
	<div use:melt={$menu} data-testid="combobox-content">
		<button
			data-testid="combobox-set-parent-click-outside-behavior-ignore"
			on:click={setRootInteractOutsideBehaviorIgnore}
		>
			set root interactOutsideBehavior: ignore
		</button>
	</div>
{/if}
