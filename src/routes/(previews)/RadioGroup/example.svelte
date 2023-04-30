<script lang="ts">
	import { RadioGroup } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';

	export let propsObj: ResolvedProps<typeof RadioGroup>;
</script>

<RadioGroup.Root
	bind:value={propsObj.Root.value}
	disabled={propsObj.Root.disabled}
	name={propsObj.Root.name}
	required={propsObj.Root.required}
	orientation={propsObj.Root.orientation}
	dir={propsObj.Root.dir}
	loop={propsObj.Root.loop}
	class="flex flex-col gap-3 data-[orientation=horizontal]:flex-row"
	aria-label="View density"
>
	<div class="flex items-center gap-3">
		<RadioGroup.Item
			class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm outline-none
		hover:bg-vermilion-100 focus:ring-2 focus:ring-black"
			value="default"
			id="r1"
		>
			<RadioGroup.Indicator class="h-3 w-3 rounded-full bg-vermilion-500 " />
		</RadioGroup.Item>
		<label class="leading-none text-white" for="r1"> Default </label>
	</div>
	<div class="flex items-center gap-3">
		<RadioGroup.Item
			class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm outline-none
		hover:bg-vermilion-100 focus:ring-2 focus:ring-black"
			value="comfortable"
			id="r2"
		>
			<RadioGroup.Indicator class="h-3 w-3 rounded-full bg-vermilion-500 " />
		</RadioGroup.Item>
		<label class="leading-none text-white" for="r2"> Comfortable </label>
	</div>
	<div class="flex items-center gap-3">
		<RadioGroup.Item
			class="grid h-6 w-6 cursor-default place-items-center rounded-full bg-white shadow-sm outline-none
		hover:bg-vermilion-100 focus:ring-2 focus:ring-black"
			value="compact"
			id="r3"
		>
			<RadioGroup.Indicator class="h-3 w-3 rounded-full bg-vermilion-500 " />
		</RadioGroup.Item>
		<label class="leading-none text-white" for="r3"> Compact </label>
	</div>
</RadioGroup.Root>
