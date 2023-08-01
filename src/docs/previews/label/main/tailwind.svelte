<script lang="ts">
	import { createLabel, melt } from '@melt-ui/svelte';

	const {
		elements: { root },
	} = createLabel();
</script>

<form>
	<div class="flex flex-col items-start justify-center">
		<label
			use:melt={$root}
			for="email"
			class="mb-0.5 font-medium"
			data-melt-part="root"
		>
			<span>Email</span>
		</label>
		<input
			type="text"
			id="email"
			class="h-10 w-[240px] rounded-md px-3 py-2 text-magnum-700"
			placeholder="vanilla@melt-ui.com"
		/>
	</div>
</form>
