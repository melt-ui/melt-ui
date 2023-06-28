<script lang="ts">
	import { createLabel } from '..';

	export let inputId = 'test';

	const { root } = createLabel();
</script>

<form>
	<div>
		<label use:root.action for={inputId}>
			<span
				>Test
				<span>*</span>
			</span>
			<input type="text" id={inputId} />
		</label>
	</div>
</form>
