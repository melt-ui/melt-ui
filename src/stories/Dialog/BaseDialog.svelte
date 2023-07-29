<script lang="ts">
	import type { Dialog } from '$lib/builders';
	import { styleToString } from '$lib/internal/helpers';
	import { cubicOut } from 'svelte/easing';
	import type { TransitionConfig } from 'svelte/transition';

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	type FlyAndScaleOptions = {
		y: number;
		start: number;
		duration?: number;
	};
	export const flyAndScale = (node: HTMLElement, options: FlyAndScaleOptions): TransitionConfig => {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: options.duration ?? 150,
			delay: 0,
			css: (t) => {
				const y = scaleConversion(t, [0, 1], [options.y, 0]);
				const scale = scaleConversion(t, [0, 1], [options.start, 1]);

				return styleToString({
					transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
					opacity: t,
				});
			},
			easing: cubicOut,
		};
	};

	export let dialog: Dialog;
	const {
		elements: { overlay, content, title, description, close },
		states: { open },
	} = dialog;
</script>

<div>
	{#if $open}
		<div melt={$overlay} class="fixed inset-0 z-40 bg-black/50" />
		<div
			class="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px]
				translate-x-[-50%] translate-y-[-50%] rounded-md bg-white p-6
				shadow-lg"
			transition:flyAndScale={{ duration: 150, y: 8, start: 0.96 }}
			melt={$content}
		>
			<slot title={$title} description={$description} close={$close} />
		</div>
	{/if}
</div>
