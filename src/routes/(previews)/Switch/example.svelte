<script lang="ts" context="module">
</script>

<script lang="ts">
	import { Switch } from '$lib';
	import type { ResolvedProps } from '../helpers';

	export let propsObj: ResolvedProps<typeof Switch>;
</script>

<form>
	<div class="flex items-center">
		<label class="pr-[15px] text-[15px] leading-none text-white" for="airplane-mode">
			Airplane mode
		</label>
		<Switch.Root
			class="relative h-[25px] w-[42px] cursor-default rounded-full bg-black/40 shadow-[0_2px_10px] shadow-black/10 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black"
			id="airplane-mode"
			bind:checked={propsObj.Root.checked}
			bind:required={propsObj.Root.required}
			bind:disabled={propsObj.Root.disabled}
			bind:name={propsObj.Root.name}
			bind:value={propsObj.Root.value}
		>
			<Switch.Thumb
				class="block h-[21px] w-[21px] translate-x-0.5 rounded-full bg-white shadow-[0_2px_2px] shadow-black/10 transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19px]"
			/>
		</Switch.Root>
	</div>
</form>
