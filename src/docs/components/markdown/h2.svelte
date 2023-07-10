<script lang="ts">
	import { cn } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h2
	class={cn(
		'mb-2.5 mt-11 scroll-m-20 border-b border-neutral-300/30 pb-1 text-[27px] font-semibold tracking-tight',
		className
	)}
	data-toc=""
	{...$$restProps}
>
	<slot />
</h2>
