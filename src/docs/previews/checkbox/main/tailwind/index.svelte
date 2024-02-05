<script lang="ts">
	import { createCheckbox, melt } from '$lib/index.js';
	import { Check, Minus } from '$icons/index.js';

	const {
		elements: { root, input },
		helpers: { isChecked, isIndeterminate },
	} = createCheckbox({
		defaultChecked: 'indeterminate',
	});
</script>

<form>
	<div class="flex items-center justify-center">
		<button
			use:melt={$root}
			class="flex size-7 appearance-none items-center justify-center
            rounded-lg bg-white text-magnum-600 shadow hover:opacity-75"
			id="checkbox"
		>
			{#if $isIndeterminate}
				<Minus class="size-5" />
			{:else if $isChecked}
				<Check class="size-5" />
			{/if}
			<input use:melt={$input} />
		</button>
		<label class="pl-4 font-medium text-magnum-900" for="checkbox">
			Accept terms and conditions.
		</label>
	</div>
</form>
