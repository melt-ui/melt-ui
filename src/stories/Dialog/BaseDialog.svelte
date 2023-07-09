<script lang="ts">
	import type { CreateDialogReturn } from '@melt-ui/svelte';
	/** Internal helpers */
	import { flyAndScale } from '$routes/helpers';

	export let dialog: CreateDialogReturn;
	const { trigger, portal, overlay, content, title, description, close, open } = dialog;
</script>

<div>
	<div use:portal>
		{#if $open}
			<div {...$overlay} class="fixed inset-0 z-40 bg-black/50" />
			<div
				class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px]
				translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-[25px]
				shadow-lg"
				transition:flyAndScale={{ duration: 150, y: 8, start: 0.96 }}
				{...$content}
				use:content
			>
				<slot title={$title} description={$description} close={$close} />
			</div>
		{/if}
	</div>
</div>
