<script lang="ts">
	import { cn } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<h2
	class={cn(
		'mb-1.5 mt-11 scroll-m-20 border-b border-b-neutral-600 pb-2 text-2xl font-bold first:mt-0',
		className
	)}
	data-toc=""
	{...$$restProps}
>
	<slot />
</h2>
