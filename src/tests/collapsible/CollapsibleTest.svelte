<script lang="ts">
	import { createCollapsible, melt, type CreateCollapsibleProps } from '$lib/index.js';

	type $$Props = CreateCollapsibleProps;

	const {
		elements: { root, trigger, content },
	} = createCollapsible({
		...$$restProps,
	});
</script>

<div use:melt={$root}>
	<button use:melt={$trigger} data-testid="trigger">Trigger</button>
	<div use:melt={$content} data-testid="content">Content</div>
</div>
