<script lang="ts">
	import { createLabel, melt } from '$lib/index.js';

	const {
		elements: { root },
	} = createLabel();
</script>

<form>
	<div class="formkit-field">
		<label
			use:melt={$root}
			for="email"
			class="formkit-label"
			data-melt-part="root"
		>
			<span>Email</span>
		</label>
		<input
			type="text"
			id="email"
			class="formkit-input"
			placeholder="vanilla@melt-ui.com"
		/>
	</div>
</form>

<style>
	.formkit-field {
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-direction: column;
	}

	.formkit-label {
		margin-bottom: 2px;
		font-weight: 500;
		color: rgb(var(--color-magnum-900) / 1);
	}

	.formkit-input {
		height: 40px;
		width: 240px;
		border-radius: 6px;
		padding: 8px 12px;
		color: rgb(var(--color-magnum-700) / 1);
	}
</style>
