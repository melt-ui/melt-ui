<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$routes/helpers';
	import CheckCircle from '~icons/lucide/check-circle';

	const liVariants = tv({
		base: 'mt-2.5',
		variants: {
			type: {
				checked: 'flex items-center gap-3',
				default: '',
			},
		},
		defaultVariants: {
			type: 'default',
		},
	});

	let className: string | undefined | null = undefined;
	export { className as class };

	export let type: VariantProps<typeof liVariants>['type'] = 'default';
</script>

<li class={cn(liVariants({ type, className }))} {...$$restProps}>
	{#if type === 'checked'}
		<CheckCircle class="h-6 w-6 text-green-400" />
	{/if}
	<slot />
</li>
