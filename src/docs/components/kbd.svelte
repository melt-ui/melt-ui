<script lang="ts">
	import { cn } from '$docs/utils/index.js';

	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<kbd class={cn(className)}><slot /></kbd>

<style>
	kbd {
		display: inline-block;
		/*		padding: _Theme('spacing[0.5]') _Theme('spacing[1.5]');*/
		/*		color: _Theme('colors.neutral.100');*/
		white-space: nowrap;

		/*		margin-block: _Theme('spacing.1');*/

		/*		background-color: _Theme('colors.neutral.800/0.8');*/
		/*		border: solid 1px _Theme('colors.neutral.500');*/
		/*		border-bottom-color: _Theme('colors.neutral.600');*/
		/*		border-radius: _Theme('borderRadius.DEFAULT');*/
		/*		box-shadow: inset 0 -1px 0 _Theme('colors.neutral.300/0.5');*/
		/*		font-size: _Theme('fontSize.xs');*/
	}
</style>
