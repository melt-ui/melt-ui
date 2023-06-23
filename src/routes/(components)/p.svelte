<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let sidenote = false;
</script>

<p
	class={cn(
		'leading-7 [&:not(:first-child)]:mt-4',
		sidenote && 'text-base italic opacity-50',
		className
	)}
	{...$$restProps}
>
	<slot />
</p>
