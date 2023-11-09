<script lang="ts">
	import { createCollapsible, melt, type CreateCollapsibleProps } from '$lib/index.js';

	export let defaultOpen: CreateCollapsibleProps['defaultOpen'] = undefined;
	export let open: CreateCollapsibleProps['open'] = undefined;
	export let disabled: CreateCollapsibleProps['disabled'] = undefined;
	export let onOpenChange: CreateCollapsibleProps['onOpenChange'] = undefined;
	export let forceVisible: CreateCollapsibleProps['forceVisible'] = undefined;

	const {
		elements: { root, trigger, content },
	} = createCollapsible({
		defaultOpen,
		disabled,
		onOpenChange,
		forceVisible,
		open,
	});
</script>

<div use:melt={$root}>
	<button use:melt={$trigger} data-testid="trigger">Trigger</button>
	<div use:melt={$content} data-testid="content">Content</div>
</div>
