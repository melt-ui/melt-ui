import { derived, readable, writable } from 'svelte/store';
import { withGet } from '..';

describe('withGet', () => {
	it('properly gets the value of a readable store', () => {
		expect(withGet(readable(1)).get()).toBe(1);
	});

	it('properly gets the value of a writable store', () => {
		const { get, set } = withGet(writable(1));
		expect(get()).toBe(1);

		set(2);
		expect(get()).toBe(2);
	});

	it('When updating the original store, withGet has the latest value', () => {
		const original = writable(1);
		const { get } = withGet(original);
		expect(get()).toBe(1);

		original.set(2);
		expect(get()).toBe(2);
	});

	it('properly gets the value of a derived store', async () => {
		const w = writable(1);
		const d = derived(w, ($w) => $w + 1);

		const { get } = withGet(d);
		expect(get()).toBe(2);

		w.set(2);
		expect(get()).toBe(3);
	});

	it('withGet.writable', async () => {
		const { get, set } = withGet.writable(1);
		expect(get()).toBe(1);

		set(2);
		expect(get()).toBe(2);
	});

	it('withGet.derived', async () => {
		const w = withGet.writable(1);
		const d = withGet.derived(w, ($w) => $w + 1);

		expect(d.get()).toBe(2);

		w.set(2);
		expect(d.get()).toBe(3);
	});
});
