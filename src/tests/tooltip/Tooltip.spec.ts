import { fireEvent, render, waitFor } from '@testing-library/svelte';
import { get, writable } from 'svelte/store';
import { describe, expect, test } from 'vitest';
import Tooltip from './Tooltip.svelte';
import { userEvent } from '@testing-library/user-event';
import { sleep } from '$lib/internal/helpers/index.js';
import type { CreateTooltipProps } from '$lib/index.js';

/**
 * Simple setup function to render the tooltip component and
 * return the user event object, trigger, content, and other
 * methods returned from the render function.
 */
function setup(props: CreateTooltipProps = {}) {
	const user = userEvent.setup();
	const returned = render(Tooltip, { props });
	const trigger = returned.getByTestId('trigger');
	const content = returned.getByTestId('content');
	return {
		...returned,
		user,
		trigger,
		content,
	};
}

describe('Tooltip', () => {
	test('It opens when hovered, and closes when left', async () => {
		const { user, trigger, content } = setup();
		expect(content).not.toBeVisible();

		await user.hover(trigger);
		expect(content).toBeVisible();

		await user.unhover(trigger);
		expect(content).not.toBeVisible();
	});

	test('It opens when focused, and closes when blurred', async () => {
		const { trigger, content } = setup();
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
		const { trigger, content } = setup({ ids });

		expect(trigger.id).toBe(ids.trigger);
		expect(content.id).toBe(ids.content);
	});

	test('When the tooltip was opened by focusing, leaving the trigger does not close it', async () => {
		const { user, trigger, content } = setup();
		expect(content).not.toBeVisible();

		trigger.focus();
		await waitFor(() => expect(content).toBeVisible());

		await user.hover(trigger);
		expect(content).toBeVisible();

		await user.unhover(trigger);
		expect(content).toBeVisible();

		trigger.blur();
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('When the tooltip was opened by pointer, blurring the trigger does not close it', async () => {
		const { user, trigger, content } = setup();
		expect(content).not.toBeVisible();

		await user.hover(trigger);
		expect(content).toBeVisible();

		trigger.focus();
		await waitFor(() => expect(content).toBeVisible());

		trigger.blur();
		await waitFor(() => expect(content).toBeVisible());

		await user.unhover(trigger);
		expect(content).not.toBeVisible();
	});

	test('When focusing the trigger, you should be able to click the content', async () => {
		const { user, trigger, content } = setup();
		expect(content).not.toBeVisible();

		await fireEvent(trigger, new FocusEvent('focus'));
		await waitFor(() => expect(content).toBeVisible());

		await user.click(content);
		expect(content).toBeVisible();
	});

	test('When tooltip is open and the user scrolls outside the content, it closes', async () => {
		const { user, trigger, content } = setup();

		await user.hover(trigger);
		expect(content).toBeVisible();

		await fireEvent.scroll(document);
		await waitFor(() => expect(content).not.toBeVisible());
	});

	test('When the tooltip is open and the user scrolls inside the content, it stays open', async () => {
		const { user, trigger, content } = setup();

		await user.hover(trigger);
		expect(content).toBeVisible();

		await user.click(content);
		expect(content).toBeVisible();
		await fireEvent.scroll(content);
		// sleep to account for any delays in the scroll event and close
		await sleep(50);
		expect(content).toBeVisible();
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
