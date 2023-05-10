<script lang="ts">
	import { Select } from '$lib';
	import type { ResolvedProps } from '$lib/internal/helpers';
	// These are internal icons, but they're not exported from the package.
	// Use your own icons instead.
	import ChevronDownIcon from '~icons/lucide/chevron-down';
	import CheckIcon from '~icons/lucide/check';

	export let propsObj: ResolvedProps<typeof Select>;
	propsObj;
</script>

<Select.Root>
	<Select.Trigger class="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-vermilion-800">
		<Select.Value placeholder="Select a fruit..." />
		<Select.Icon><ChevronDownIcon /></Select.Icon>
	</Select.Trigger>

	<Select.Content class="overflow-hidden rounded-md bg-white shadow-md">
		<Select.ScrollUpButton />
		<Select.Viewport class="px-4 py-2">
			<Select.Item value="apple" class="flex items-center">
				<p class="text-vermilion-800" slot="text">Apple</p>
				<CheckIcon slot="indicator" />
			</Select.Item>
			<Select.Item value="banana" class="flex items-center">
				<p class="text-vermilion-800" slot="text">Banana</p>
				<CheckIcon slot="indicator" />
			</Select.Item>
			<Select.Item value="grape" class="flex items-center">
				<p class="text-vermilion-800" slot="text">Grape</p>
				<CheckIcon slot="indicator" />
			</Select.Item>

			<Select.Group>
				<Select.Label />
				<Select.Item value="kiwi" class="flex items-center">
					<p class="text-vermilion-800" slot="text">Kiwi</p>
					<CheckIcon slot="indicator" />
				</Select.Item>
			</Select.Group>

			<Select.Separator />
		</Select.Viewport>
		<Select.ScrollDownButton />
		<Select.Arrow />
	</Select.Content>
</Select.Root>
