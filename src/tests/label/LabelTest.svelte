<script lang="ts">
	import { createLabel } from '$lib/index.js';

	export let inputId = 'test';

	const {
		elements: { root },
	} = createLabel();
</script>

<form>
	<div>
		<label use:root for={inputId}>
			<span
				>Test
				<span>*</span>
			</span>
			<input type="text" id={inputId} />
		</label>
	</div>
</form>
