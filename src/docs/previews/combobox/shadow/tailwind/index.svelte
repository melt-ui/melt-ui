<script lang="ts">
	import { onMount } from 'svelte';
	import ComboBox from './ComboBox.svelte';

	export let elementRoot: HTMLElement;

	onMount(() => {
		if (elementRoot) {
			const shadowRoot = elementRoot.attachShadow({ mode: 'open' });
			const styleElement = document.createElement('style');
			styleElement.innerHTML = `
				.root {
					display: flex; flex-direction: column; gap: .25rem;
				}
				.label {
					font-weight: 500; font-size: .875rem; line-height: 1.25rem; color: #793a15;
				}
				.input {
					display: flex; height: 2.5rem; align-items: center; justify-content: space-between; border-radius: .5rem;
				  background-color: white; padding: 0 3rem 0 .75rem; color: black;
				}
				.chevron {
					position: absolute; right: 0.5rem; top: 50%; z-index: 10; transform: translateY(-50%); color: #793a15;
				}
				.menu {
					padding: 0; margin: 0;
					border-radius: .5rem; overflow: hidden; display: flex; flex-direction: column; max-height: 300px; z-index: 10;
  			}
				.menu-inner {
					color: #000; padding: .5rem; background-color: white; overflow-y: auto; gap: 0px;
					display: flex; flex-direction: column; max-height: 100%;
				}
				.menu-item {
					position: relative; cursor: pointer; scroll-margin-top: 0.5rem; scroll-margin-bottom: 0.5rem;
					color: #262626; text-transform: capitalize; font-weight: 600; padding: .25rem 1rem .25rem 1rem;
					border-radius: .375rem;
				}
				.menu-item[data-highlighted] {
					color: #793a15; background: #fce0ac;
				}
				.text-wrapper {
					padding-left: 1rem;
				}
				.title-text { font-weight: 500 }
				.author-text { opacity: .75; font-size: .875rem; line-height: 1.25rem; display: block; }
				.check {
					position: absolute; left: .5rem; top: 50%; color: #f38d1c;
					translate: 0 calc(-50% + 1px);
				}
    }`;

			const componentRoot = document.createElement('div');
			shadowRoot.appendChild(componentRoot);

			shadowRoot.appendChild(styleElement);
			new ComboBox({
				target: componentRoot,
				props: {
					componentRoot,
				},
			});
		}
	});
</script>

<main bind:this={elementRoot} />
