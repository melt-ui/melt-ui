<script lang="ts" context="module">
	export type AccordionHeaderProps = BaseProps;
</script>

<script lang="ts">
	import { useActions } from '$lib/internal/helpers/useActions';

	import type { BaseProps } from '$lib/internal/types';

	type $$Props = AccordionHeaderProps;
</script>

<h3 {...$$restProps} use:useActions={$$restProps.use}>
	<slot />
</h3>
