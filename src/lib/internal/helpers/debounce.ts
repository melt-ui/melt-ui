export function debounce<F extends (...params: any[]) => void>(fn: F, delay: number) {
	let timeoutID: ReturnType<typeof setTimeout> | null = null;
	const clear = () => {
		if (!timeoutID) return;
		clearTimeout(timeoutID);
		timeoutID = null;
	};

	const debounceFn = function (this: any, ...args: any[]) {
		clear();
		timeoutID = window.setTimeout(() => fn.apply(this, args), delay) as unknown as ReturnType<
			typeof setTimeout
		>;
	} as F & { immediate: F; cancel: () => void };

	debounceFn.immediate = ((...args: Parameters<F>) => {
		clear();
		return fn(args);
	}) as F;

	debounceFn.cancel = clear;

	return debounceFn;
}
