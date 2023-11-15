<script lang="ts">
	import { SidebarNav } from '$docs/components/index.js';
	import Switch from '$docs/components/switch.svelte';
	import { getUsingPreprocessor } from '$routes/store.js';

	const usingPreprocessor = getUsingPreprocessor();
</script>

<div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
	<aside
		class="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full
		shrink-0 flex-col overflow-y-auto pb-2 scrollbar scrollbar-track-neutral-700 scrollbar-thumb-magnum-400 scrollbar-thumb-rounded-full scrollbar-w-2 md:sticky md:flex"
	>
		<div class="py-6 pr-6 lg:py-8">
			<SidebarNav />
		</div>
		<div class="sticky bottom-0 flex w-full justify-center rounded-xl bg-neutral-800 px-4 py-3">
			<Switch id="preprocessor" bind:checked={$usingPreprocessor} keepState>
				<a href="/docs/preprocessor" class="underline transition hover:opacity-75">
					Preprocessor
				</a>
			</Switch>
		</div>
	</aside>
	<div class="mx-auto w-full min-w-0">
		<slot />
	</div>
</div>
