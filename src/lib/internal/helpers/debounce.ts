export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, wait = 500) {
	let timeout: ReturnType<typeof setTimeout> | null = null;

	return function (...args: Parameters<T>) {
		const later = () => {
			timeout = null;
			fn(...args);
		};

		timeout && clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
