<script lang="ts">
	import { cn } from '$docs/utils';

	import { tv, type VariantProps } from 'tailwind-variants';

	const ulVariants = tv({
		base: '',
		variants: {
			type: {
				icon: 'my-5 list-none',
				default: 'my-5 ml-6 list-disc',
			},
		},
		defaultVariants: {
			type: 'default',
		},
	});

	let className: string | undefined | null = undefined;
	export { className as class };
	export let type: VariantProps<typeof ulVariants>['type'] = 'default';
</script>

<ul class={cn(ulVariants({ type, className }))} {...$$restProps}>
	<slot />
</ul>
