<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$docs/components';

	$: message = $page.status === 404 ? 'Page not found' : 'Something went wrong';
</script>

<main class="grid min-h-full w-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
	<div class="text-center">
		<p class="font-semibold text-magnum-500">{$page.status}</p>
		<h1 class="mt-4 text-4xl font-bold tracking-tight">{message}</h1>
		<div class="mt-10 flex items-center justify-center gap-x-6">
			<Button href="/docs" class="mt-4">Back to docs</Button>
		</div>
	</div>
</main>
