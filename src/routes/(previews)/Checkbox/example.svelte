<script lang="ts">
	import { Checkbox } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import Check from '~icons/lucide/check';

	export let propsObj: ResolvedProps<typeof Checkbox>['Root']['checked'];
</script>

<form>
	<div class="flex items-center justify-center">
		<Checkbox.Root
			class="flex h-6 w-6 appearance-none items-center justify-center
			rounded-sm bg-white shadow-lg outline-none hover:opacity-75
			focus:ring focus:ring-black disabled:bg-vermilion-300"
			disabled={propsObj.Root.disabled}
			bind:checked={propsObj.Root.checked}
			name={propsObj.Root.name}
			value={propsObj.Root.value}
			required={propsObj.Root.required}
			id="c1"
		>
			<Checkbox.Indicator class="text-vermilion-700">
				<Check />
			</Checkbox.Indicator>
		</Checkbox.Root>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="c1">
			Accept terms and conditions.
		</label>
	</div>
</form>
