<script lang="ts">
	import { Docs } from '$routes/(components)';
	import { createSwitch } from '$lib';

	const { root, input, isChecked } = createSwitch();
</script>

<Docs.PreviewWrapper>
	<form>
		<div class="flex items-center">
			<label class="pr-4 leading-none text-white" for="airplane-mode"> Airplane mode </label>
			<button
				{...$root}
				class="relative h-6 w-11 cursor-default rounded-full bg-magnum-800 transition-colors data-[state=checked]:bg-magnum-950"
				id="airplane-mode"
			>
				<span
					class="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform will-change-transform
					{$isChecked && 'translate-x-[22px]'}"
				/>
				<input {...$input} />
			</button>
		</div>
	</form>
</Docs.PreviewWrapper>
