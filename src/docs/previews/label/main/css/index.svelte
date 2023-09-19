<script lang="ts">
	import { createLabel, melt } from '@melt-ui/svelte';

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
		color: hsl(22, 70%, 28%);
	}
	.formkit-input {
		height: 40px;
		width: 240px;
		border-radius: 6px;
		padding: 8px 12px;
		color: hsl(24, 83%, 40%);
	}
</style>
