<script lang="ts">
	import { createCollapsible } from '..';

	export let open = false;

	const { root, trigger, content } = createCollapsible({
		open,
	});
</script>

<div {...$root}>
	<button {...$trigger} use:trigger.action data-testid="trigger">Trigger</button>
	<div {...$content} data-testid="content">Content</div>
</div>
