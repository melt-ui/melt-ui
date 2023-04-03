<script lang="ts" context="module">
    import type { BaseProps } from "$lib/types";
    import { uniqueContext } from "$lib/helpers/uniqueContext";

    export type SwitchProps = BaseProps<HTMLButtonElement> & {
        checked?: boolean,
        defaultChecked?: boolean,
        required?: boolean,
        disabled?: boolean,
        name?: string,
        value?: string
    };

    type SwitchContext = {
        checked: Writable<SwitchProps['checked']>,
        disabled: Readable<SwitchProps['disabled']>
    }

    const { getContext, setContext } = uniqueContext<SwitchContext>();
    export const getSwitchContext = getContext;

    export function getState(checked: boolean | undefined) {
        return checked ? 'checked' : 'unchecked';
    }
</script>

<script lang="ts">
    type $$Props = SwitchProps;
    
    import { derived, writable, type Readable, type Writable } from 'svelte/store';
    import { controllableState } from "$lib/helpers/controllableState";
	
    export let defaultChecked: $$Props['checked'] = false;
    export let required: $$Props['required'] = false;
    export let value: $$Props['value'] = 'on';

    export let checked: $$Props['checked'] = defaultChecked;
    const writableChecked = controllableState(checked, (v) => checked = v);
	$: $writableChecked = checked;

    export let disabled: $$Props['disabled'] = false;
    const writableDisabled = writable(disabled);
    $: if (typeof disabled !== 'undefined') $writableDisabled = disabled;

    let button : HTMLButtonElement;
    $: isFormControl = button ? button.closest('form') : true;

	setContext({
		checked: writableChecked,
        disabled: derived(writableDisabled, (v) => v)
	});
</script>

<button
    bind:this={button}
    type="button"
    role="switch"
    class={$$props.class}
    aria-checked={checked}
    aria-required={required}
    aria-labelledby={$$props.id}
    data-state={getState(checked)}
    data-disabled={disabled ? '' : undefined}
    {value}
    {disabled}
    {...$$restProps}
    on:click={() => {
        $writableChecked = !$writableChecked;
    }}
>
    <slot />
</button>

{ #if isFormControl }
<input 
    type="checkbox"
    aria-hidden
    tabindex="-1"
    name={$$props.name}
    {value}
    {checked}
    {required}
    {disabled}
    style="
        position: absolute;
        pointer-events: none;
        opacity: 0;
        margin: 0;
        transform: translateX(-100%);
    "
>
{ /if }