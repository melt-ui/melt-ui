<script lang="ts">
	import { createLabel } from '$lib/index.js';

	export let inputId = 'test';

	const {
		elements: { root },
	} = createLabel();
</script>

<form>
	<div>
		<label use:root for={inputId} data-testid="label">
			<span>Test</span>
			<input type="text" id={inputId} data-testid="input" />
		</label>
	</div>
</form>
