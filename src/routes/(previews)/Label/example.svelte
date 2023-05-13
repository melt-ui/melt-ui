<script lang="ts">
	import { Label } from '$lib';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
</script>

<div>
	<fieldset class="flex w-full flex-col justify-start">
		<Label.Root class="mb-2.5 block text-sm leading-none text-white" for="firstName">
			Name
		</Label.Root>
		<input
			class="h-8 shrink-0 grow rounded border px-2.5
				leading-none text-vermilion-900 outline-none focus:ring-2 focus:ring-vermilion-800"
			id="firstName"
			value="Thomas G. Glopes"
			type="text"
		/>
	</fieldset>
</div>
