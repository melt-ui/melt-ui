<script lang="ts">
	import { cn } from '$routes/helpers';
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<p class={cn('mt-2 text-xl text-neutral-400', className)}><slot /></p>
