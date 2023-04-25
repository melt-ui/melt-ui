<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	type Orientation = 'horizontal' | 'vertical';

	export type SeparatorRootProps = BaseProps<'div'> & {
		/** The orientation of the separator. */
		orientation?: Orientation;
		/** When true, signifies that it is purely visual, carries no semantic meaning, and ensures it is not present in the accessibility tree. */
		decorative?: boolean;
	};
</script>

<script lang="ts">
	type $$Props = SeparatorRootProps;

	export let orientation: $$Props['orientation'] = 'horizontal';
	export let decorative: $$Props['decorative'] = false;
</script>

<div
	data-orientation={orientation}
	role={decorative ? 'none' : 'separator'}
	{...$$restProps}
	use:useActions={$$restProps.use}
/>
