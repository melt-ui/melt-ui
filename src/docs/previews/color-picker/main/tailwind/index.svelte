<script lang="ts">
	import { createColorPicker } from '$lib';

	const ctx = createColorPicker();

	const {
		elements: { canvas },
	} = ctx;
</script>

<canvas {...$canvas} use:canvas class="rounded-md" width="288" height="288" />
