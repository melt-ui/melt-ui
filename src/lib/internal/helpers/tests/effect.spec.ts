import { writable } from 'svelte/store';
import { effect, noop, sleep } from '../index.js';
import { vi } from 'vitest';
import { tick } from 'svelte';

describe('effect', () => {
	it('Gets called initially', () => {
		let calls = 0;
		const unsub = effect([], () => {
			calls++;
		});

		expect(calls).toBe(1);
		unsub();
	});

	it('Gets called when a store changes', async () => {
		const w = writable(1);
		let calls = 0;
		const unsub = effect(w, () => {
			calls++;
		});
		expect(calls).toBe(1);

		w.set(2);
		expect(calls).toBe(2);
		unsub();
	});

	it('Returned callback gets called before new execution', async () => {
		const w = writable(1);
		let calls = 0;
		const unsub = effect(w, () => {
			return () => {
				calls++;
			};
		});

		w.set(2);
		expect(calls).toBe(1);
		unsub();
	});

	it('Returned callback gets called when unsubscribed', async () => {
		const w = writable(1);
		let calls = 0;
		const unsub = effect(w, () => {
			return () => {
				calls++;
			};
		});
		expect(calls).toBe(0);
		unsub();
		expect(calls).toBe(1);
	});

	it('Respect `skipFirstRun` prop', async () => {
		const w = writable(1);
		let calls = 0;
		const unsub = effect(
			w,
			() => {
				calls++;
			},
			{ skipFirstRun: true }
		);
		expect(calls).toBe(0);

		w.set(2);
		expect(calls).toBe(1);
		unsub();
	});

	it('Respect `runAfterTick` prop', async () => {
		vi.mock('svelte', () => ({
			...vi.importActual('svelte'),
			tick: vi.fn(() => Promise.resolve()),
		}));
		const fn = vi.fn(noop);
		const unsub = effect([], fn, { runAfterTick: true });

		expect(fn).not.toHaveBeenCalled();
		expect(tick).toHaveBeenCalled();
		/** Fn should not be called synchronously */
		expect(fn).not.toHaveBeenCalled();
		await sleep(0);
		expect(fn).toHaveBeenCalled();

		unsub();
		vi.restoreAllMocks();
	});
});
