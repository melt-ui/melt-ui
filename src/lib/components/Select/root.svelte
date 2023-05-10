<script lang="ts" context="module">
	import { reactiveContext, useActions } from '$lib/internal/helpers';
	import type { BaseProps, Defaults } from '$lib/internal/types';

	export type Direction = 'ltr' | 'rtl';
	export type SelectRootProps = BaseProps<'div'> & {
		value?: string;
		open?: boolean;
		name?: string;
		dir?: Direction;
		disabled?: boolean;
		required?: boolean;
	};

	const defaults = {
		dir: 'ltr',
		required: false,
		disabled: false,
		open: false,
	} satisfies Defaults<SelectRootProps>;

	type SelectRootContext = {
		open: boolean;
		value?: string;
	};

	const { getContext, setContext } = reactiveContext<SelectRootContext>();
	export const getSelectRootContext = getContext;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';

	type $$Props = SelectRootProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'] = undefined;
	export let open: $$Props['open'] = defaults.open;
	export let name: $$Props['name'] = '';
	export let dir: $$Props['dir'] = defaults.dir;
	export let disabled: $$Props['disabled'] = defaults.disabled;
	export let required: $$Props['required'] = defaults.required;

	const ctx = setContext({
		open: [open ?? defaults.open, (value) => (open = value)],
		value: [value, (v) => (value = v)],
	});
	$: ctx.set({ open: open ?? defaults.open, value });
</script>

<Popper.Root>
	<div {...$$restProps} use:useActions={use ?? []}>
		{JSON.stringify($ctx)}
		<slot />
		{#if name}
			<input type="hidden" {name} {value} />
		{/if}
	</div>
</Popper.Root>
