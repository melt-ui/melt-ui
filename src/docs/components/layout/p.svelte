<script lang="ts">
	import { cn } from '$docs/utils';

	let className: string | undefined | null = undefined;
	export { className as class };
	export let sidenote = false;
</script>

<p
	class={cn('leading-7 ', sidenote && 'text-base italic [&:not(code)]:opacity-60', className)}
	{...$$restProps}
>
	<slot />
</p>
