import { render } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import { describe, expect, test } from 'vitest';
import Tooltip from './Tooltip.svelte';

describe('2 tooltips, group=true', () => {
	test('When a tooltip opens, the other closes', () => {
		const open1 = writable(true);
		const open2 = writable(false);

		render(Tooltip, {
			open: open1,
			group: true,
		});
		render(Tooltip, {
			open: open2,
			group: true,
		});

		open2.set(true);

		expect(get(open1)).toBe(false);
		expect(get(open2)).toBe(true);
	});

	test('When both are rendered with open=true, the first closes', () => {
		const open1 = writable(true);
		const open2 = writable(true);

		render(Tooltip, {
			open: open1,
			group: true,
		});
		render(Tooltip, {
			open: open2,
			group: true,
		});

		expect(get(open1)).toBe(false);
		expect(get(open2)).toBe(true);
	});
});

describe('2 tooltips, different groups', () => {
	const group1 = 'A';
	const group2 = 'B';

	test('When a tooltip opens, the other stays open', () => {
		const open1 = writable(true);
		const open2 = writable(false);

		render(Tooltip, {
			open: open1,
			group: group1,
		});
		render(Tooltip, {
			open: open2,
			group: group2,
		});

		open2.set(true);

		expect(get(open1)).toBe(true);
		expect(get(open2)).toBe(true);
	});
});

describe('2 tooltips, group=false', () => {
	test('When a tooltip opens, the other stays open', () => {
		const open1 = writable(true);
		const open2 = writable(false);

		render(Tooltip, {
			open: open1,
			group: false,
		});
		render(Tooltip, {
			open: open2,
			group: false,
		});

		open2.set(true);

		expect(get(open1)).toBe(true);
		expect(get(open2)).toBe(true);
	});
});

describe('2 tooltips, group=undefined', () => {
	test('When a tooltip opens, the other stays open', () => {
		const open1 = writable(true);
		const open2 = writable(false);

		render(Tooltip, {
			open: open1,
			group: undefined,
		});
		render(Tooltip, {
			open: open2,
			group: undefined,
		});

		open2.set(true);

		expect(get(open1)).toBe(true);
		expect(get(open2)).toBe(true);
	});
});
