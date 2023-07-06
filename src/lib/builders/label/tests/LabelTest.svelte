<script lang="ts">
	import { createLabel } from '..';

	export let inputId = 'test';

	const label = createLabel();
</script>

<form>
	<div>
		<label use:label for={inputId}>
			<span
				>Test
				<span>*</span>
			</span>
			<input type="text" id={inputId} />
		</label>
	</div>
</form>
