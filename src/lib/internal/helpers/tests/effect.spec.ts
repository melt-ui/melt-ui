import { writable } from 'svelte/store';
import { effect } from '..';

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
});
