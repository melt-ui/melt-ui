let count = 0;

export function generateId() {
	return `radix-svelte-${count++}`;
}

export function getElementById(id: string) {
	return document.querySelector(`[data-radix-id="${id}"]`) as HTMLElement | null;
}
