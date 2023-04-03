<script lang="ts" context="module">
	export const props = {
		Root: {
			checked: { type: 'boolean' },
            defaultChecked: { type: 'boolean' },
            required: { type: 'boolean' },
            disabled: { type: 'boolean' },
            name: { type: 'string' },
            value: { type: 'string' }
		},
        Thumb: {}
	} satisfies PreviewProps<typeof Switch>;
</script>

<script lang="ts">
	import { Switch } from '$lib';
	import { getPropsObj, type PreviewProps } from '../helpers';

	export let propsObj = getPropsObj<typeof Switch>(props);
</script>

<form>
    <div class="flex items-center">
        <label class="text-white text-[15px] leading-none pr-[15px]" for="airplane-mode">
            Airplane mode
        </label>
        <Switch.Root
            class="w-[42px] h-[25px] bg-black/40 rounded-full relative shadow-[0_2px_10px] shadow-black/10 focus:shadow-[0_0_0_2px] focus:shadow-black data-[state=checked]:bg-black outline-none cursor-default"
            id="airplane-mode"
            bind:checked={propsObj.Root.checked}
            bind:required={propsObj.Root.required}
            bind:disabled={propsObj.Root.disabled}
            bind:name={propsObj.Root.name}
            bind:value={propsObj.Root.value}
        >
        <Switch.Thumb class="block w-[21px] h-[21px] bg-white rounded-full shadow-[0_2px_2px] shadow-black/10 transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
    </div>
</form>