import { describe, it, vi } from 'vitest';
import { executeCallbacks } from '../callbacks.js';

describe('executeCallbacks', () => {
	it('groups callbacks and executes them together', () => {
		const functionMock = vi.fn();
		const callbackMock = vi.fn();
		/**
		 * `functionMock` should be called immediately whereas `callbackMock`
		 * should be called when the executeCallbacks function is invoked.
		 */
		function testFunction() {
			functionMock();
			return () => {
				callbackMock();
			};
		}

		// Create a listener group.
		const cleanup = executeCallbacks(testFunction(), testFunction(), testFunction());
		// Assert that `functionMock` was called 3x and `callbackMock` was not.
		expect(functionMock).toBeCalledTimes(3);
		expect(callbackMock).not.toBeCalled();
		// Invoke the cleanup function, which should fire the callbacks.
		cleanup();
		// Assert that `callbackMock` was called 3x.
		expect(callbackMock).toBeCalledTimes(3);
	});
});
