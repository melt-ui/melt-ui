<script>
	import { browser } from '$app/environment';
</script>

<!-- Dev mode only tailwind indicator help with making things more responsive -->

<div
	class="fixed bottom-1 left-8 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 p-3 font-mono text-xs text-white"
	data-browser={browser ? '' : undefined}
>
	{browser ? 'js' : 'ssr'}
</div>
