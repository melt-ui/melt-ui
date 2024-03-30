<script lang="ts">
	import { createLinkPreview, melt, type CreateLinkPreviewProps } from '$lib/index.js';

	type $$Props = CreateLinkPreviewProps;

	const {
		elements: { trigger, content },
		states: { open },
	} = createLinkPreview({ ...$$restProps, forceVisible: true, openDelay: 0, closeDelay: 0 });
</script>

<button use:melt={$trigger} data-testid="link-preview-trigger">trigger</button>
{#if $open}
	<div use:melt={$content} data-testid="link-preview-content" />
{/if}
