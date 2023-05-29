<script lang="ts" context="module">
	import { reactiveContext, type Defaults } from '$lib/internal/helpers';

	export type CollapsibleRootProps = BaseProps & {
		/**
		 * The controlled open state of the collapsible.
		 */
		open?: boolean;
		/**
		 * When `true`, prevents the user from interacting with the collapsible.
		 */
		disabled?: boolean;
	};

	type RootContext = {
		open: boolean;
		readonly disabled: boolean;
	};

	const defaults = {
		open: false,
		disabled: false,
	} satisfies Defaults<RootContext>;

	const { getContext, setContext } = reactiveContext<RootContext>(defaults);
	export const getCollapsibleRootContext = getContext;
</script>

<script lang="ts">
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';

	type $$Props = CollapsibleRootProps;
	export let open: $$Props['open'] = defaults.open;
	export let disabled: $$Props['disabled'] = defaults.disabled;
	export let use: $$Props['use'] = [];

	const ctx = setContext({ open: (v) => (open = v) });
	$: ctx.set({ open, disabled });
</script>

<div
	data-state={open ? 'open' : 'closed'}
	data-disabled={disabled ? 'true' : undefined}
	use:useActions={use ?? []}
	{...$$restProps}
>
	<slot />
</div>
