<script lang="ts">
	import { SidebarNav } from '$docs/components';
</script>

<div
	class="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:gap-10"
>
	<aside
		class="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto md:sticky md:block"
	>
		<div class="py-6 pr-6 lg:py-8">
			<SidebarNav />
		</div>
	</aside>
	<div class="mx-auto w-full min-w-0">
		<slot />
	</div>
</div>
