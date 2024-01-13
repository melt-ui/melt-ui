import { render, waitFor } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import { describe, expect, test } from 'vitest';
import Tooltip from './Tooltip.svelte';
import userEvent from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';

describe('Tooltip', () => {
	test('It opens when hovered, and closes when left', async () => {
		const { getByTestId } = render(Tooltip);
		const user = userEvent.setup();

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(content).not.toBeVisible();

		user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());

		user.unhover(trigger);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('It opens when focused, and closes when blurred', async () => {
		const { getByTestId } = render(Tooltip);

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(content).not.toBeVisible();

		trigger.focus();
		await waitFor(() => expect(content).toBeVisible());

		trigger.blur();
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('Applies custom ids when provided', async () => {
		const ids = {
			trigger: 'id-trigger',
			content: 'id-content',
		};
		const { getByTestId } = render(Tooltip, {
			ids,
		});

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(trigger.id).toBe(ids.trigger);
		expect(content.id).toBe(ids.content);
	});

	test.skip('When the tooltip was opened by focusing, leaving the trigger does not close it', async () => {
		const { getByTestId } = render(Tooltip);
		const user = userEvent.setup();

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(content).not.toBeVisible();

		trigger.focus();
		await waitFor(() => expect(content).toBeVisible());

		user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());

		user.unhover(trigger);
		await waitFor(() => expect(content).toBeVisible());

		trigger.blur();
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test.skip('When the tooltip was opened by pointer, blurring the trigger does not close it', async () => {
		const { getByTestId } = render(Tooltip);
		const user = userEvent.setup();

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(content).not.toBeVisible();

		user.hover(trigger);
		await waitFor(() => expect(content).toBeVisible());

		trigger.focus();
		await waitFor(() => expect(content).toBeVisible());

		trigger.blur();
		await sleep(100);
		await waitFor(() => expect(content).toBeVisible());

		user.unhover(trigger);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test.skip('When focusing the trigger, you should be able to click the content', async () => {
		const { getByTestId } = render(Tooltip);

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');
		expect(content).not.toBeVisible();

		trigger.focus();
		await waitFor(() => expect(content).toBeVisible());

		userEvent.click(content);
		await sleep(100);
		await waitFor(() => expect(content).toBeVisible());
	});
});

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

describe('Single tooltip, group=true', () => {
	test('Tooltip does not prevent itself from opening', () => {
		const open = writable(true);
		render(Tooltip, {
			open,
			group: true,
		});

		open.set(false);

		open.set(true);
		expect(get(open)).toBe(true);
	});
});
