<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';

	export type AspectRatioProps = BaseProps<HTMLDivElement> & {
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
	>
		<slot />
	</div>
</div>
