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

<nav class="border-b border-b-white/50">
	<a class="flex items-center gap-2 uppercase font-mono" href="/">
		<img class="w-12 h-10 object-contain" src="/logo.svg" alt="Radix and Svelte logos" />
		Radix Svelte
	</a>
</nav>
<slot />
