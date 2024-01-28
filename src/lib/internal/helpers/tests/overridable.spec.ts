import { writable } from 'svelte/store';
import { overridable } from '..';

describe('overridable', () => {
	it('works as expected without setting onChange fn', () => {
		const store = writable(1);
		const o = overridable(store);
		expect(o.get()).toBe(1);

		o.set(2);
		expect(o.get()).toBe(2);
	});

	it('updates when original store updates', () => {
		const store = writable(1);
		const o = overridable(store);
		expect(o.get()).toBe(1);

		store.set(2);
		expect(o.get()).toBe(2);
	});

	it('onChange is called when original store updates', () => {
		const store = writable(1);
		let called = false;
		const o = overridable(store, ({ next }) => {
			called = true;
			return next + 1;
		});
		expect(o.get()).toBe(1);

		o.set(2);
		expect(o.get()).toBe(3);
		expect(called).toBe(true);
	});

	it('curr and next are passed to onChange', () => {
		const store = writable(1);
		let curr: number | undefined;
		let next: number | undefined;
		const o = overridable(store, ({ curr: _curr, next: _next }) => {
			curr = _curr;
			next = _next;
			return _next;
		});

		o.set(2);
		expect(curr).toBe(1);
		expect(next).toBe(2);
	});
});
