<script lang="ts">
	import { cn } from '$routes/helpers';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<hr class={cn('my-4 border-neutral-600 md:my-8', className)} {...$$restProps} />
