<script lang="ts" context="module">
	import { useActions } from '$lib/internal/helpers/useActions';
	import type { BaseProps } from '$lib/internal/types';

	export type AspectRatioProps = BaseProps & {
		ratio?: number;
	};
</script>

<script lang="ts">
	type $$Props = AspectRatioProps;
	export let ratio = 1 / 1;
</script>

<div
	style:position="relative"
	style:width="100%"
	style:padding-bottom="{100 / ratio}%"
	data-radix-aspect-ratio-wrapper=""
>
	<div
		style:position="absolute"
		style:top="0"
		style:right="0"
		style:bottom="0"
		style:left="0"
		style={$$props.style}
		{...$$restProps}
		use:useActions={$$restProps.use}
	>
		<slot />
	</div>
</div>
