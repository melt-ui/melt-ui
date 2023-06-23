<script lang="ts">
	import { cn } from '$routes/helpers';

	export let fullwidth = false;
</script>

<div class="comp-preview h-[20rem] overflow-x-auto lg:h-[28rem] lg:overflow-x-hidden">
	<div class={cn('mx-auto max-w-md px-4', fullwidth && 'w-full max-w-none')}>
		<slot />
	</div>
</div>

<style lang="postcss">
	.comp-preview {
		display: flex;
		/* justify-content: center; */
		align-items: center;

		background: linear-gradient(315deg, theme('colors.magnum.600'), theme('colors.magnum.500'));

		border-radius: theme('borderRadius.lg');
		/* padding: theme('spacing.8'); */

		@media screen('md') {
			padding: theme('spacing.12');
		}
	}
</style>
