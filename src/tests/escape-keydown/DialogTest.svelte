<script lang="ts">
	import { createDialog, melt, type CreateDialogProps } from '$lib/index.js';

	type $$Props = CreateDialogProps & { setRootEscapeBehaviorIgnore: () => void };
	export let setRootEscapeBehaviorIgnore: () => void;

	export let escapeBehavior: CreateDialogProps['escapeBehavior'] = 'close';

	const {
		elements: { trigger, content, portalled },
		states: { open },
	} = createDialog({ escapeBehavior, forceVisible: true });
</script>

<button use:melt={$trigger} data-testid="dialog-trigger">Open</button>
{#if $open}
	<div use:melt={$portalled}>
		<div use:melt={$content} data-testid="dialog-content">
			<button
				data-testid="dialog-set-parent-escape-behavior-ignore"
				on:click={setRootEscapeBehaviorIgnore}
			>
				set root escapeBehavior: ignore
			</button>
		</div>
	</div>
{/if}
