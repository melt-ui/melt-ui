export function throttle<T extends (...args: unknown[]) => unknown>(func: T, delay: number) {
	let lastCall = 0;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return function (...args: Parameters<T>) {
		const now = new Date().getTime();

		if (now - lastCall < delay) {
			// If a call was made before the delay, schedule the next call
			if (timeoutId !== null) {
				clearTimeout(timeoutId);
			}

			timeoutId = setTimeout(() => {
				lastCall = now;
				func(...args);
			}, delay - (now - lastCall));
		} else {
			// If enough time has passed since the last call, execute the function immediately
			lastCall = now;
			func(...args);
		}
	};
}
