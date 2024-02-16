import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import ToggleGroupTest from './ToggleGroupTest.svelte';
import { tick } from 'svelte';
import { writable } from 'svelte/store';
import type { CreateToggleGroupProps } from '$lib/index.js';
import { testKbd as kbd } from '../utils.js';

const items = ['item-1', 'item-2', 'item-3'];
const defaults: { items: string[]; type: 'single' | 'multiple' } = {
	items,
	type: 'single',
};

function setup<T extends 'single' | 'multiple'>(
	props?: CreateToggleGroupProps<T> & { items?: string[]; type: 'single' | 'multiple' }
) {
	const withDefaults = { ...defaults, ...props };
	const user = userEvent.setup();
	const result = render(ToggleGroupTest, withDefaults);
	const tabButton = result.getByTestId('tab-btn');
	const root = result.getByTestId('root');
	return { user, ...result, tabButton, root };
}

describe('Toggle Group', () => {
	test('has no accessibility violations', async () => {
		const { container } = render(ToggleGroupTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('tab does not navigate between items', async () => {
		const { user, getByTestId } = setup();

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();

		await user.tab();

		for (const item of items) {
			expect(getByTestId(item)).not.toHaveFocus();
		}
	});

	test('keyboard navigation between items', async () => {
		const { getByTestId, user } = setup({
			type: 'single',
			loop: false,
		});

		getByTestId(items[0]).focus();

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(kbd.ARROW_RIGHT);
		}

		for (const item of [...items].reverse()) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(kbd.ARROW_LEFT);
		}
	});

	test('keyboard navigation between items - loop', async () => {
		const { getByTestId, user } = setup({
			type: 'single',
			loop: true,
		});

		getByTestId(items[0]).focus();

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(kbd.ARROW_RIGHT);
		}

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(kbd.ARROW_RIGHT);
		}
	});

	test('only one item can be selected in single mode', async () => {
		const { getByTestId, user } = setup({
			type: 'single',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'true');

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId(items[1])).toHaveFocus();
		await user.keyboard(kbd.SPACE);

		const root = getByTestId('root');
		const checkedItems = root.querySelectorAll<HTMLElement>('[aria-checked="true"]');
		expect(checkedItems.length).toBe(1);
	});

	test('multiple items can be selected in multiple mode', async () => {
		const { getByTestId, user } = setup({
			type: 'multiple',
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'true');

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId(items[1])).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');

		const root = getByTestId('root');
		const checkedItems = root.querySelectorAll<HTMLElement>('[aria-pressed="true"]');
		expect(checkedItems.length).toBe(2);
	});

	test('can uncheck items in single mode', async () => {
		const { getByTestId, user } = setup({
			type: 'single',
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'true');
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'false');
	});

	test('can uncheck items in multiple mode', async () => {
		const { getByTestId, user } = setup({
			type: 'multiple',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'true');
		await user.keyboard(kbd.SPACE);
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'false');
	});

	test('defaultValue is respected in single mode', async () => {
		const { getByTestId } = setup({
			type: 'single',
			defaultValue: items[1],
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-checked', 'true');
	});

	test('defaultValue is respected in multiple mode', async () => {
		const { getByTestId } = setup({
			type: 'multiple',
			defaultValue: [items[1], items[2]],
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[2])).toHaveAttribute('aria-pressed', 'true');
	});

	test('value prop overrides defaultValue - single', async () => {
		const valueStore = writable<string>(items[1]);
		const { getByTestId } = setup({
			type: 'single',
			defaultValue: items[0],
			value: valueStore,
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-checked', 'true');
	});

	test('value prop overrides defaultValue - multiple', async () => {
		const valueStore = writable<string[]>([items[1], items[2]]);
		const { getByTestId } = setup({
			type: 'multiple',
			defaultValue: [items[0]],
			value: valueStore,
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[2])).toHaveAttribute('aria-pressed', 'true');
	});

	test('value prop programmatically updates - single', async () => {
		const valueStore = writable<string>(items[1]);
		const { getByTestId } = setup({
			type: 'single',
			value: valueStore,
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-checked', 'true');

		valueStore.set(items[0]);
		await tick();

		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[1])).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-checked', 'true');
	});

	test('value prop programmatically updates - multiple', async () => {
		const valueStore = writable<string[]>([items[1], items[2]]);
		const { getByTestId } = setup({
			type: 'multiple',
			value: valueStore,
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[2])).toHaveAttribute('aria-pressed', 'true');

		valueStore.set([items[0]]);
		await tick();

		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-pressed', 'true');
	});

	test('change function is respected - single', async () => {
		const { getByTestId, user } = setup({
			type: 'single',
			onValueChange: () => items[0],
		});

		const root = getByTestId('root');
		const checkedItems = root.querySelectorAll<HTMLElement>('[aria-checked="true"]');
		expect(checkedItems.length).toBe(0);

		const item2 = getByTestId(items[1]);
		await user.click(item2);
		expect(item2).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'true');
	});

	test('change function is respected - multiple', async () => {
		const { user, getByTestId } = setup({
			type: 'multiple',
			onValueChange: () => [items[0], items[1]],
		});

		const root = getByTestId('root');
		const pressedItems = root.querySelectorAll<HTMLElement>('[aria-pressed="true"]');
		expect(pressedItems.length).toBe(0);

		const item3 = getByTestId(items[2]);
		await user.click(item3);
		expect(item3).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');
	});

	test('toggle group focusable when in single mode', async () => {
		const { user, tabButton, getByTestId } = setup();

		tabButton.focus();
		expect(tabButton).toHaveFocus();
		await user.keyboard(kbd.TAB);
		expect(getByTestId(items[0])).toHaveFocus();
	});

	test('toggle group focusable when in multiple mode', async () => {
		const { user, tabButton, getByTestId } = setup({ type: 'multiple', items });

		tabButton.focus();
		expect(tabButton).toHaveFocus();
		await user.keyboard(kbd.TAB);
		expect(getByTestId(items[0])).toHaveFocus();
	});
});
