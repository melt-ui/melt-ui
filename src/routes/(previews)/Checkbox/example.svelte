<script lang="ts" context="module">
	export const props = {
		Root: {
			checked: {
				type: 'boolean',
				default: false
			},
			disabled: {
				type: 'boolean'
			},
			required: {
				type: 'boolean',
				hideControls: true
			},
			name: {
				type: 'string',
				hideControls: true
			},
			value: {
				type: 'string',
				hideControls: true
			},
			'data-disabled': {
				type: 'data-attribute',
				values: ['true', 'false']
			},
			'data-state': {
				type: 'data-attribute',
				values: ['checked', 'unchecked', 'indeterminate']
			}
		},
		Indicator: {}
	} satisfies PreviewProps<typeof Checkbox>;
</script>

<script lang="ts">
	import { Checkbox } from '$lib/components/Checkbox';
	import { getPropsObj, type PreviewProps } from '../helpers';

	import CheckIcon from '~icons/radix-icons/check';

	export let propsObj = getPropsObj<typeof Checkbox>(props);
</script>

<form>
	<div class="flex items-center">
		<Checkbox.Root
			class="flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-[4px] bg-white shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-violet-100 focus:shadow-[0_0_0_2px_black] disabled:bg-violet-300 "
			disabled={propsObj.Root.disabled}
			bind:checked={propsObj.Root.checked}
			name={propsObj.Root.name}
			value={propsObj.Root.value}
			required={propsObj.Root.required}
			id="c1"
		>
			<Checkbox.Indicator class="text-violet-700">
				<CheckIcon />
			</Checkbox.Indicator>
		</Checkbox.Root>
		<label class="pl-[15px] text-[15px] leading-none text-white" for="c1">
			Accept terms and conditions.
		</label>
	</div>
</form>
