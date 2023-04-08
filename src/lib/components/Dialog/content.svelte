<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';

	export type DialogContentProps = BaseProps;
</script>

<script lang="ts">
	type $$Props = DialogContentProps;
</script>

<div {...$$restProps}>
	<slot />
</div>
