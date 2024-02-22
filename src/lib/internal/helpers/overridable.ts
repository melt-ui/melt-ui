import { writable, type Readable, type Updater, type Writable } from 'svelte/store';
import { isReadable, isWritable } from './is.js';
import { withGet, type WithGet } from './withGet.js';

export type ChangeFn<T> = (args: { curr: T; next: T }) => T;

/**
 * A wrapper over Svelte's Writable store that allows for overriding the update method.
 * - The first argument is the initial value or a writable store.
 * - The second argument is an optional callback that is called before the value is updated.
 * It receives an object with the current and next values, and should return the modified next value.
 */
export const overridable = <T>(value: Readable<T> | T, onChange?: ChangeFn<T>) => {
	const _store = isReadable(value) ? value : (writable(value) as Readable<T> | Writable<T>);
	const store = withGet(_store) as unknown as WithGet<Readable<T>> & WithGet<Writable<T>>;

	const update = (updater: Updater<T>, sideEffect?: (newValue: T) => void) => {
		if (!isWritable(store)) return;
		store.update((curr) => {
			const next = updater(curr);
			let res: T = next;
			if (onChange) {
				res = onChange({ curr, next });
			}

			sideEffect?.(res);
			return res;
		});
	};

	const set: typeof store.set = (curr) => {
		update(() => curr);
	};

	return {
		...store,
		update,
		set,
	};
};

const ERRORS = {
	SET: 'Cannot call `overridden.set` from within the `set` method, use the returned `commit` function instead.',
	SET_READABLE: `Cannot call \`overridden.set\` from within the \`set\` method, use the returned \`commit\` function instead. 
Alternatively, call \`set\` on the store that was passed in to \`overridable\`.`,
};

export const newOverridable = <In, Out = In>(
	value: Readable<In> | In,
	getset?: {
		get?: (value: In) => Out;
		set: (values: { curr: Out; next: Out; commit: (newValue: In) => void }) => void;
	}
) => {
	const _store = isReadable(value) ? value : (writable(value) as Readable<In> | Writable<In>);
	const store = withGet(_store) as unknown as WithGet<Readable<In>> & WithGet<Writable<In>>;
	const derived = withGet.derived(store, (getset?.get ?? ((v) => v)) as (v: In) => Out);

	/** To prevent an internal set from calling the getset.set method */
	let depth = 0;

	const update = (updater: Updater<Out>) => {
		depth++;
		const curr = derived.get();
		const next = updater(curr);
		if (depth === 1) {
			getset?.set?.({ curr, next, commit: (newValue) => store.set(newValue) });
		} else {
			if (isReadable(store)) {

				throw new Error(ERRORS.SET_READABLE);
			} else {

				throw new Error(ERRORS.SET);
			}
		}

		if (!getset?.set) {
			store.set(next as unknown as In);
		}
		depth--;
	};

	const set = (nv: Out) => {
		update(() => nv);
	};

	return {
		...derived,
		update,
		set,
	};
};
