<script lang="ts">
	import { createNavigationMenu } from '@melt-ui/svelte';
	import { ChevronDown } from 'lucide-svelte';

	const {
		elements: { root },
		builders: { createMenuItem },
	} = createNavigationMenu();
	const {
		elements: { content, item, link, trigger },
	} = createMenuItem();
</script>

<nav
	class="relative z-10 flex max-w-max flex-1 items-center justify-center rounded-md bg-white"
	{...$root}
>
	<div class="relative">
		<ul
			class="group flex flex-1 list-none items-center justify-center space-x-1"
			dir="ltr"
			data-orientation="horizontal"
		>
			<li {...$item}>
				<button {...$trigger()} use:trigger class="trigger group">
					Getting Started
					<ChevronDown
						class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</button>
				<div {...$content} use:content />
			</li>
			<li>
				<button {...$trigger()} use:trigger class="trigger group">
					Builders
					<ChevronDown
						class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</button>
				<div {...$content} use:content />
			</li>
			<li>
				<button {...$trigger()} use:trigger class="trigger group">
					Documentation
					<ChevronDown
						class="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
						aria-hidden="true"
					/>
				</button>
				<div {...$content} use:content />
			</li>
		</ul>
	</div>
</nav>

<style lang="postcss">
	.trigger {
		@apply inline-flex h-10 w-max items-center justify-center rounded-md bg-white;
		@apply px-4 py-2 text-sm font-medium transition-colors hover:bg-magnum-500/20;
		@apply text-magnum-600 hover:text-magnum-600 focus:outline-none;
		@apply disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-magnum-300/50;
		@apply data-[state=open]:bg-magnum-300/50;
	}

	.content {
		@apply left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto;
	}
</style>
