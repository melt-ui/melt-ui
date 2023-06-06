let count = 0;

export function generateId() {
	return `radix-svelte-${count++}`;
}
