<script lang="ts">
	import { page } from '$app/stores';
	import { schemas } from '$routes/(previews)/schemas';
	import { cn, sortedEntries } from '$routes/helpers';

	type Link = {
		title: string;
		href: string;
	};

	let links: Link[] = sortedEntries(schemas).map(([key, schema]) => ({
		title: schema.title,
		href: `/docs/${key}`,
	}));
</script>

<div class="flex grid-cols-12 flex-col gap-8 py-6 lg:grid lg:px-4 overflow-hidden">
	<div class="col-span-2">
		<ul class="flex w-full overflow-x-auto px-4 pb-2 lg:block lg:px-0">
			{#each links as link}
				<li>
					<a
						class={cn(
							'block whitespace-nowrap rounded-md border border-transparent px-3 py-2',
							'hover:bg-vermilion-600/25',
							'data-[active=true]:border-vermilion-600 data-[active=true]:bg-vermilion-600/25'
						)}
						data-active={$page.url.pathname === link.href}
						href={link.href}>{link.title}</a
					>
				</li>
			{/each}
		</ul>
	</div>
	<div class="col-span-8 px-4 lg:px-0">
		<slot />
	</div>
	<div class="col-span-2" />
</div>
