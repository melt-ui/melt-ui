import { tick } from 'svelte';
import type { Action } from 'svelte/action';

function getFocusableElements(container: HTMLElement) {
	const elements = Array.from(
		container.querySelectorAll(
			'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
		)
	) as HTMLElement[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return elements.filter((el) => !(el as any)?.disabled);
}

type Params = {
	disable?: boolean;
	autofocus?: boolean;
};

const getParams = (params?: Params) => {
	return {
		disable: false,
		autofocus: true,
		...params,
	};
};

export const focusTrap = ((container, params?: Params) => {
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

	const update = (newParams?: Params) => {
		const params = getParams(newParams);

		document.removeEventListener('focusin', handleFocusIn);
		container.removeEventListener('keydown', handleKeyDown);
		if (params?.disable) return;

		// Autofocus the first focusable element in the container
		if (params?.autofocus) {
			const focusableElements = getFocusableElements(container);
			if (focusableElements.length > 0) {
				tick().then(() => focusableElements[0].focus());
			}
		}

		document.addEventListener('focusin', handleFocusIn);
		container.addEventListener('keydown', handleKeyDown);
		container.setAttribute('tabindex', '-1');
	};

	update(params);

	return {
		update,
		destroy() {
			document.removeEventListener('focusin', handleFocusIn);
			container.removeEventListener('keydown', handleKeyDown);
		},
	};
}) satisfies Action;
