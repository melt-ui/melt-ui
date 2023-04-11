<script lang="ts" context="module">
	export type AccordionHeaderProps = BaseProps;
</script>

<script lang="ts">
	import { useActions } from '$lib/helpers/useActions';

	import type { BaseProps } from '$lib/types';

	type $$Props = AccordionHeaderProps;
</script>

<h3 {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</h3>
