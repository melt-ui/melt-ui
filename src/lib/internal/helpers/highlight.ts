export function addHighlight(element: HTMLElement) {
	element.setAttribute('data-highlighted', '');
}

export function removeHighlight(element: HTMLElement) {
	element.removeAttribute('data-highlighted');
}
