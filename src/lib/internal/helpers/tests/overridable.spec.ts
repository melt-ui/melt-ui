import { writable } from 'svelte/store';
import { newOverridable, overridable, withGet } from '../index.js';

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

describe('new overridable', () => {
	it('works as expected without setting set or get fn', () => {
		const store = writable(1);
		const o = newOverridable(store);

		expect(o.get()).toBe(1);

		o.set(2);
		expect(o.get()).toBe(2);
	});

	it('updates when original store updates', () => {
		const store = writable(1);
		const o = newOverridable(store);
		expect(o.get()).toBe(1);

		store.set(2);
		expect(o.get()).toBe(2);
	});

	it('set is called when store updates', () => {
		const store = writable(1);
		let called = false;
		const o = newOverridable(store, {
			set: ({ next, commit }) => {
				called = true;
				commit(next + 1);
			},
		});
		expect(o.get()).toBe(1);

		o.set(2);
		expect(o.get()).toBe(3);
		expect(called).toBe(true);
	});

	it('curr and next are passed to set', () => {
		const store = writable(1);
		let curr: number | undefined;
		let next: number | undefined;
		const o = newOverridable(store, {
			set: ({ curr: _curr, next: _next }) => {
				curr = _curr;
				next = _next;
				return _next;
			},
		});

		o.set(2);
		expect(curr).toBe(1);
		expect(next).toBe(2);
	});

	it('Get and set fn works as expected', () => {
		const store = withGet.writable(1);
		const o = newOverridable(store, {
			get: (v) => `${v}`,
			set: ({ next, commit }) => {
				commit(Number(next));
			},
		});

		o.get(); // '1'
		o.set('2');

		expect(o.get()).toBe('2');
		expect(store.get()).toBe(2);

		store.set(3);
		expect(o.get()).toBe('3');
	});

	it('Throws error when calling overriden.set from within set', () => {
		const store = withGet.writable(1);
		const o = newOverridable(store, {
			set: ({ commit }) => {
				commit(2);
				o.set(3);
			},
		});

		expect(() => o.set(2)).toThrowError();
	})

	it('Works when calling store.set from within set', () => {
		const store = withGet.writable(1);
		const o = newOverridable(store, {
			set: ({ next, commit }) => {
				commit(next);
				store.set(next + 1);
			},
		});

		o.set(2);
		expect(o.get()).toBe(3);
	})
});
