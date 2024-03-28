// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(fn: T, wait = 500) {
	let timeout: NodeJS.Timeout;

	const debounced = (...args: Parameters<T>) => {
		clearTimeout(timeout);
		const later = () => fn(...args);
		timeout = setTimeout(later, wait);
	};

	debounced.destroy = () => clearTimeout(timeout);
	return debounced;
}
