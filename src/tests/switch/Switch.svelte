<script lang="ts">
	import { createSwitch, melt } from '$lib/index.js';

	const {
		elements: { root, input },
	} = createSwitch();
</script>

<main>
	<form>
		<label id="airplane-mode-label" for="airplane-mode"> Airplane mode </label>
		<button use:melt={$root} id="airplane-mode" aria-labelledby="airplane-mode-label" />

		<input use:melt={$input} />
	</form>
</main>
