<script lang="ts" context="module">
	import type { BaseProps } from '$lib/types';

	export type FocusTrapProps = BaseProps<'div'>;
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	type $$Props = FocusTrapProps;

	let container: HTMLElement;

	function getFocusableElements(container: HTMLElement) {
		const elements = Array.from(
			container.querySelectorAll(
				'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
			)
		) as HTMLElement[];
		return elements.filter((el) => !el.disabled);
	}

	onMount(() => {
		const handleFocusIn = (event: Event) => {
			if (!container.contains(event.target as Node)) {
				container.focus();
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				event.preventDefault();

				const focusableElements = getFocusableElements(container);
				if (focusableElements.length === 0) {
					return;
				}

				const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
				let nextIndex = 0;

				if (event.shiftKey) {
					nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
				} else {
					nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
				}

				focusableElements[nextIndex].focus();
			}
		};

		// Autofocus the first focusable element in the container
		const focusableElements = getFocusableElements(container);
		if (focusableElements.length > 0) {
			focusableElements[0].focus();
		}

		document.addEventListener('focusin', handleFocusIn);
		container.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('focusin', handleFocusIn);
			container.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<div tabindex="-1" bind:this={container} {...$$restProps}>
	<slot />
</div>
