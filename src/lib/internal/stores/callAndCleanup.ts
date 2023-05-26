type FnThatCanReturnFn = () => (() => void) | void;
type Runner<T> = (cb: (arg: T) => void) => void;

export const createCallAndCleanup = () => ({
	subscribe(runner: Runner<FnThatCanReturnFn>) {
		let cleanup: (() => void) | null = null;

		runner((cb: FnThatCanReturnFn) => {
			cleanup?.();

			cleanup = cb() ?? null;
		});

		return () => {
			cleanup?.();
			cleanup = null;
		};
	},
});
