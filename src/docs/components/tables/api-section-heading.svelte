<script lang="ts">
	import { h3 as H3 } from '$docs/components/markdown';
	import { InfoTooltip } from '$docs/components';
	export let title: string;
	export let description: string;
</script>

<div
	class="absolute -left-[1px] -top-[1px] flex items-center gap-1.5 rounded-br-md rounded-tl-md border border-magnum-600 bg-magnum-600/25 px-3 py-1.5"
>
	<H3 class="mb-0 mt-0">{title}</H3>
	<InfoTooltip>
		{@html description}
	</InfoTooltip>
</div>
