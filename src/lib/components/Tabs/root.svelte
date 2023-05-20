<script lang="ts" context="module">
	import { reactiveContext, type Defaults } from '$lib/internal/helpers';
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';

	export type Orientation = 'horizontal' | 'vertical';
	export type Direction = 'ltr' | 'rtl';
	export type ActivateOn = 'focus' | 'click';

	export type TabsRootProps = BaseProps<'div'> & {
		value?: string;
		orientation?: Orientation;
		dir?: Direction;
		activateOn?: ActivateOn;
	};

	type TabsRootContext = {
		value?: string;
		readonly activateOn?: ActivateOn;
		readonly orientation?: Orientation;
		readonly dir?: Direction;
	};

	const defaults = {
		value: undefined,
		activateOn: 'focus',
		orientation: 'horizontal',
		dir: 'ltr',
	} satisfies Defaults<TabsRootContext>;

	const { getContext, setContext } = reactiveContext<TabsRootContext>(defaults);
	export const getTabsRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = TabsRootProps;

	export let value: $$Props['value'] = defaults.value;
	// TODO: read from somewhere
	export let dir: $$Props['dir'] = defaults.dir;
	export let orientation: $$Props['orientation'] = defaults.orientation;
	export let activateOn: $$Props['activateOn'] = defaults.activateOn;

	const ctx = setContext({ value: (v) => (value = v) });
	$: ctx.update((old) => ({ ...old, value, activateOn, orientation, dir }));
</script>

<div {dir} data-orientation={orientation} {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</div>
