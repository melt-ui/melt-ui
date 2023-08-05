<script lang="ts">
	import { createCollapsible, melt } from '$lib';

	export let open = false;

	const {
		elements: { root, trigger, content },
	} = createCollapsible({
		defaultOpen: open,
	});
</script>

<div use:melt={$root}>
	<button use:melt={$trigger} data-testid="trigger">Trigger</button>
	<div use:melt={$content} data-testid="content">Content</div>
</div>
