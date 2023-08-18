<script lang="ts">
	import { melt } from '$lib/index.js';
	import { ctx } from '../ctx.js';
	const {
		elements: { arrow },
	} = ctx.getMenu();
</script>

<div use:melt={$arrow} />
