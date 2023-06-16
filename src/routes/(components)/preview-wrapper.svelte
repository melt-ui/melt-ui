<script lang="ts">
	import { cn } from '$routes/helpers';

	export let fullwidth = false;
</script>

<div class="comp-preview mt-8 h-96 overflow-x-auto">
	<div class={cn('mx-auto max-w-md px-4', fullwidth && 'w-full')}>
		<slot />
	</div>
</div>

<style lang="postcss">
	.comp-preview {
		display: flex;
		/* justify-content: center; */
		align-items: center;

		background: linear-gradient(315deg, theme('colors.magnum.700'), theme('colors.magnum.600'));

		border-radius: theme('borderRadius.lg');
		/* padding: theme('spacing.8'); */

		@media screen('md') {
			padding: theme('spacing.12');
		}
	}
</style>
