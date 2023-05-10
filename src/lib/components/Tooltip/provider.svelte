<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers';
	import type { BaseProps } from '$lib/internal/types';

	export type TooltipProviderProps = BaseProps & {
		delayDuration?: number;
		skipDelayDuration?: number;
	};
</script>

<script lang="ts">
	type $$Props = TooltipProviderProps;
	export let use: $$Props['use'] = [];
</script>

<div {...$$restProps} use:useActions={use ?? []}>
	<slot />
</div>
