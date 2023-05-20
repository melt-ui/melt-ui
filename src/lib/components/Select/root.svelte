<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	export type Direction = 'ltr' | 'rtl';
	export type SelectRootProps = BaseProps<'div'> & {
		value?: string;
		open?: boolean;
		name?: string;
		dir?: Direction;
		disabled?: boolean;
		required?: boolean;
	};

	type SelectRootContext = {
		open: boolean;
		value?: string;
	};

	const defaults = {
		open: false,
		value: undefined,
	} satisfies Defaults<SelectRootContext>;

	const { getContext, setContext } = reactiveContext<SelectRootContext>(defaults);
	export const getSelectRootContext = getContext;
</script>

<script lang="ts">
	import { Popper } from '$lib/internal/components';
	import { reactiveContext, type Defaults } from '$lib/internal/helpers';

	type $$Props = SelectRootProps;
	export let use: $$Props['use'] = [];
	export let value: $$Props['value'] = undefined;
	export let open: $$Props['open'] = defaults.open;
	export let name: $$Props['name'] = '';
	export let dir: $$Props['dir'] = 'ltr';
	export let disabled: $$Props['disabled'] = false;
	export let required: $$Props['required'] = false;

	const ctx = setContext({ open: (v) => (open = v), value: (v) => (value = v) });
	$: ctx.set({ open: open, value });
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
