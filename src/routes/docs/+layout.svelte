<script lang="ts">
	import { SidebarNav } from '$docs/components';
	import Switch from '$docs/components/switch.svelte';
	import { usingPreprocessor } from '$routes/store';
</script>

<div class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
	<aside
		class="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0
		flex-col pb-2 md:sticky md:flex"
	>
		<div class="overflow-y-auto py-6 pr-6 lg:py-8">
			<SidebarNav />
		</div>
		<div class="flex w-full justify-center rounded-lg bg-neutral-800 px-4 py-2">
			<Switch id="preprocessor" bind:checked={$usingPreprocessor} keepState>Preprocessor</Switch>
		</div>
	</aside>
	<div class="mx-auto w-full min-w-0">
		<slot />
	</div>
</div>
