<script lang="ts">
	import { tv, type VariantProps } from 'tailwind-variants';
	import { cn } from '$routes/helpers';
	const calloutVariants = tv({
		base: 'relative rounded-tr-md rounded-br-md px-5 py-3 before:absolute before:left-0 before:top-0 before:h-full before:w-0.5 before:content-[""] my-6',
		variants: {
			type: {
				default: 'before:bg-magnum-500 bg-magnum-500/10 text-white border-magnum-500',
				info: 'before:bg-blue-500 bg-blue-500/10 text-white border-blue-500',
				warning: 'before:bg-yellow-500 bg-yellow-500/10 text-white border-yellow-500',
				danger: 'before:bg-red-500 bg-red-500/10 text-white border-red-500',
				success: 'before:bg-green-500 bg-green-500/10 text-white border-green-500',
			},
		},
	});

	let className: string | undefined | null = undefined;
	export { className as class };
	export let type: VariantProps<typeof calloutVariants>['type'] = 'default';
</script>

<div class={cn(calloutVariants({ type, className }))}>
	<p>
		<slot />
	</p>
</div>
