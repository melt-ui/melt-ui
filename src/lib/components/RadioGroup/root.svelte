<script lang="ts" context="module">
	import { collectionContext, next, prev, useActions } from '$lib/internal/helpers';
	import { reactiveContext, type Defaults } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	type Orientation = 'horizontal' | 'vertical';
	type Direction = 'ltr' | 'rtl';

	export type RadioGroupRootProps = BaseProps<'div'> & {
		value?: string;
		disabled?: boolean;
		name?: string;
		required?: boolean;
		orientation?: Orientation;
		dir?: Direction;
		loop?: boolean;
	};

	type RadioGroupRootContext = {
		value?: string;
		readonly disabled?: boolean;
		readonly required?: boolean;
		readonly name?: string;
	};

	const defaults = {
		value: undefined,
		disabled: false,
		required: false,
		name: undefined,
	} satisfies Defaults<RadioGroupRootContext>;
	const { getContext, setContext } = reactiveContext<RadioGroupRootContext>(defaults);
	export const getRadioGroupRootContext = getContext;

	const itemCollection = collectionContext();
	export const getRadioGroupItemCollection = itemCollection.getContext;
</script>

<script lang="ts">
	type $$Props = RadioGroupRootProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'] = defaults.value;
	export let dir: $$Props['dir'] = 'ltr';
	export let disabled: $$Props['disabled'] = defaults.disabled;
	export let required: $$Props['required'] = defaults.required;
	export let orientation: $$Props['orientation'] = undefined;
	export let name: $$Props['name'] = defaults.name;
	export let loop: $$Props['loop'] = true;

	const ctx = setContext({ value: (v) => (value = v) });
	$: ctx.set({ value, disabled, required, name });
	// Item logic
	const itemStore = itemCollection.setContext();
	$: nextKeys = {
		horizontal: [dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'],
		vertical: ['ArrowDown'],
		both: ['ArrowDown', dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'],
	}[orientation || 'both'];

	$: prevKeys = {
		horizontal: [dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'],
		vertical: ['ArrowUp'],
		both: ['ArrowUp', dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'],
	}[orientation || 'both'];

	const listeners = new Map();
	itemStore.subscribe((items) => {
		items.forEach((item, index) => {
			const prevCallback = listeners.get(index);
			if (prevCallback) {
				item.removeEventListener('keydown', prevCallback);
			}

			const listener = (e: KeyboardEvent) => {
				const enabledItems = items.filter((i) => i.dataset.disabled === undefined);
				const enabledIdx = enabledItems.indexOf(item);

				if (nextKeys.includes(e.key)) {
					e.preventDefault();
					const el = next(enabledItems, enabledIdx, loop);
					el?.focus();
					el?.click();
				} else if (prevKeys.includes(e.key)) {
					e.preventDefault();
					const el = prev(enabledItems, enabledIdx, loop);
					el?.focus();
					el?.click();
				}
			};

			listeners.set(index, listener);
			item.addEventListener('keydown', listener);
		});
	});
</script>

<div
	{dir}
	role="radiogroup"
	tabindex="0"
	data-disabled={disabled ? '' : undefined}
	data-orientation={orientation}
	aria-orientation={orientation}
	aria-required={required}
	{...$$restProps}
	use:useActions={use ?? []}
>
	<slot />
</div>
