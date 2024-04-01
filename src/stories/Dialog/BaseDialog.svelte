<script lang="ts">
	import { createDialog, melt } from '$lib/index.js';

	const {
		elements: { overlay, content, title, description, close, portalled, trigger },
	} = createDialog({
		portal: '#preview',
	});
</script>

<div use:melt={$portalled}>
	<div use:melt={$overlay} class="fixed inset-0 z-40 bg-black/50" />
	<div
		class="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] max-w-[450px]
				-translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6
				shadow-lg"
		use:melt={$content}
	>
		<slot title={$title} description={$description} close={$close} name="content" />
	</div>
</div>
<slot trigger={$trigger} />
