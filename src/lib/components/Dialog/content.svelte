<script lang="ts" context="module">
	import FocusTrap from '$lib/internal/components/FocusTrap.svelte';
	import type { BaseProps } from '$lib/types';

	export type DialogContentProps = BaseProps;
</script>

<script lang="ts">
	type $$Props = DialogContentProps;
</script>

<FocusTrap role="dialog" {...$$restProps}>
	<slot />
</FocusTrap>
