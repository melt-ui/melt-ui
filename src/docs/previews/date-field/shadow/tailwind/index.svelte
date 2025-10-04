<script lang="ts">
	import { onMount } from 'svelte';
	import DateField from './DateField.svelte';
	import css from './styles.css?raw';

	export let elementRoot: HTMLElement;

	onMount(() => {
		if (elementRoot) {
			const shadowRoot = elementRoot.attachShadow({ mode: 'open' });
			const styleElement = document.createElement('style');
			styleElement.innerHTML = css;
			const componentRoot = document.createElement('div');
			shadowRoot.appendChild(componentRoot);
			shadowRoot.appendChild(styleElement);
			new DateField({
				target: componentRoot,
				props: {
					componentRoot,
				},
			});
		}
	});
</script>

<main bind:this={elementRoot} />
