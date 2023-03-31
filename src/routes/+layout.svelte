<script>
	import '../app.postcss';

	import '@fontsource/inter/300.css';
	import '@fontsource/inter/400.css';
	import '@fontsource/inter/500.css';
	import '@fontsource/inter/600.css';
	import '@fontsource/inter/700.css';
	import '@fontsource/inter/800.css';
	import '@fontsource/inter/900.css';
</script>

<nav class="border-b border-b-white/50 py-2 px-4">
	<a class="flex items-center gap-2 font-sans font-thin text-xl" href="/">
		<img class="w-9 h-9 object-contain rounded-sm" src="/logo.svg" alt="Radix and Svelte logos" />
		Radix Svelte
	</a>
</nav>
<slot />
