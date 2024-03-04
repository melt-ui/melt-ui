<script lang="ts">
	import { createScrollArea, melt, type CreateScrollAreaProps } from '$lib/index.js';
	import { removeUndefined } from '../utils.js';

	const flavors = [
		'Vanilla',
		'Chocolate',
		'Strawberry',
		'Mint Chocolate Chip',
		'Cookies and Cream',
		'Rocky Road',
		'Pistachio',
		'Neapolitan',
		'Butter Pecan',
		'Salted Caramel',
		'Coffee',
		'Mango',
		'Raspberry Ripple',
		'Lemon Sorbet',
		'Green Tea',
		'Coconut',
		'Black Cherry',
		'Banana',
		'Almond Fudge',
		'Cinnamon',
		'Blueberry Cheesecake',
		'Tiramisu',
		'Red Velvet',
		'Matcha',
		'Peanut Butter Cup',
		'Cookie Dough',
		'Rum Raisin',
		'Birthday Cake',
		'Lychee',
		'Honey Lavender',
	];

	type $$Props = CreateScrollAreaProps & {
		height?: string;
		width?: string;
	};

	export let height = '288px';
	export let width = '490px';

	export let type: $$Props['type'] = 'hover';

	const {
		elements: { root, content, viewport, corner, scrollbarY, thumbY, scrollbarX, thumbX },
	} = createScrollArea(
		removeUndefined({
			type,
			...$$restProps,
		})
	);
</script>

<div
	use:melt={$root}
	class="relative overflow-hidden rounded-md border bg-white text-magnum-900 shadow-lg"
	data-testid="root"
	style:width
	style:height
>
	<div use:melt={$viewport} class="h-full w-full rounded-[inherit]" data-testid="viewport">
		<div use:melt={$content} data-testid="content">
			<div class="w-[300px] p-4" data-testid="inner-content">
				<h4 class="mb-4 font-semibold leading-none">Endless Flavors</h4>
				<div data-testid="hover">Hover me please</div>
				{#each flavors as flavor (flavor)}
					<div class="text-sm">
						{flavor}
					</div>
					<div role="separator" class="my-2 h-px w-full bg-magnum-600" />
				{/each}
			</div>
		</div>
	</div>
	<div
		use:melt={$scrollbarY}
		data-testid="scrollbar-y"
		class="flex h-full w-2.5 border-l border-l-transparent bg-magnum-800/10 p-px"
	>
		<div
			use:melt={$thumbY}
			data-testid="thumb-y"
			class="relative flex-1 rounded-full bg-magnum-600"
		/>
	</div>

	<div
		use:melt={$scrollbarX}
		data-testid="scrollbar-x"
		class="flex h-full w-2.5 border-l border-l-transparent bg-magnum-800/10 p-px"
	>
		<div use:melt={$thumbX} data-testid="thumb-x" class="relative rounded-full bg-magnum-600" />
	</div>
	<div use:melt={$corner} />
</div>
