<script lang="ts">
	import { createCollapsible } from '..';

	export let open = false;

	const { root, trigger, content } = createCollapsible({
		open,
	});
</script>

<div melt={$root}>
	<button melt={$trigger} data-testid="trigger">Trigger</button>
	<div melt={$content} data-testid="content">Content</div>
</div>
