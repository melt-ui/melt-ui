<script lang="ts">
	import { createDialog } from '@melt-ui/svelte';

	const { trigger, portal, overlay, content, title, description, close, open } = createDialog();
</script>

<main>
	<button melt={$trigger} data-testid="trigger">Open</button>
	<div use:portal>
		<div melt={$overlay} />
		<div melt={$content} data-testid="content">
			<h2 melt={$title}>Title</h2>
			<p melt={$description}>Description</p>
			<button melt={$close}>Close</button>
		</div>
	</div>
</main>
