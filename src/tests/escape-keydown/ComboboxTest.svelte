<script lang="ts">
	import { createCombobox, melt, type CreateComboboxProps } from '$lib/index.js';

	type $$Props = CreateComboboxProps & { setRootEscapeBehaviorIgnore: () => void };
	export let setRootEscapeBehaviorIgnore: () => void;

	const {
		elements: { input, menu },
		states: { open },
	} = createCombobox({ ...$$restProps, forceVisible: true });
</script>

<input use:melt={$input} data-testid="combobox-trigger" />
{#if $open}
	<div use:melt={$menu} data-testid="combobox-content">
		<button
			data-testid="combobox-set-parent-escape-behavior-ignore"
			on:click={setRootEscapeBehaviorIgnore}
		>
			set root escapeBehavior: ignore
		</button>
	</div>
{/if}
