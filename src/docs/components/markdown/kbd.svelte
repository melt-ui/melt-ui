<script lang="ts">
	import { cn } from '$docs/utils/index.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<kbd class={cn(className)}><slot /></kbd>

<style>
	kbd {
		display: inline-block;
		padding: theme('spacing[0.5]') theme('spacing[1.5]');
		color: theme('colors.neutral.100');
		white-space: nowrap;

		margin-block: theme('spacing.1');

		background-color: theme('colors.neutral.800/0.8');
		border: solid 1px theme('colors.neutral.500');
		border-bottom-color: theme('colors.neutral.600');
		border-radius: theme('borderRadius.DEFAULT');
		box-shadow: inset 0 -1px 0 theme('colors.neutral.300/0.5');
		font-size: theme('fontSize.xs');
	}
</style>
