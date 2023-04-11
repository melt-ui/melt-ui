<script lang="ts" context="module">
	import { reactiveContext } from '$lib/helpers/reactiveContext';
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';

	type Orientation = 'horizontal' | 'vertical';
	type Direction = 'ltr' | 'rtl';
	type ActivateOn = 'focus' | 'click';

	export type TabsRootProps = BaseProps<'div'> & {
		value?: string;
		orientation?: Orientation;
		dir?: Direction;
		activateOn?: ActivateOn;
	};

	type TabsRootContext = {
		value?: string;
		activateOn?: ActivateOn;
	};

	const { getContext, setContext } = reactiveContext<TabsRootContext>();
	export const getTabsRootContext = getContext;
</script>

<script lang="ts">
	type $$Props = TabsRootProps;

	export let value: $$Props['value'] = undefined;
	// TODO: read from somewhere
	export let dir: $$Props['dir'] = 'ltr';
	export let orientation: $$Props['orientation'] = 'horizontal';
	export let activateOn: $$Props['activateOn'] = 'focus';

	const ctx = setContext({
		value: [value, (v) => (value = v)],
		activateOn: [activateOn, (v) => (activateOn = v)],
	});
	$: ctx.update((old) => ({ ...old, value, activateOn }));
</script>

<div {dir} data-orientation={orientation} {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</div>
