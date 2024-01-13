import { kbd } from '$lib/internal/helpers/keyboard.js';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import ToggleGroupTest from './ToggleGroupTest.svelte';
import { tick } from 'svelte';
import { writable } from 'svelte/store';

const items = ['item-1', 'item-2', 'item-3'];

describe('Toggle Group', () => {
	test('has no accessibility violations', async () => {
		const { container } = render(ToggleGroupTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('tab does not navigate between items', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();

		await user.tab();

		for (const item of items) {
			expect(getByTestId(item)).not.toHaveFocus();
		}
	});

	test('keyboard navigation between items', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
		});

		getByTestId(items[0]).focus();

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		}

		for (const item of [...items].reverse()) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(`{${kbd.ARROW_LEFT}}`);
		}
	});

	test('keyboard navigation between items - loop', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
			loop: true,
		});

		getByTestId(items[0]).focus();

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		}

		for (const item of items) {
			expect(getByTestId(item)).toHaveFocus();
			await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		}
	});

	test('only one item can be selected in single mode', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'true');

		await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		expect(getByTestId(items[1])).toHaveFocus();
		await user.keyboard(`{${kbd.SPACE}}`);

		const root = getByTestId('root');
		const checkedItems = root.querySelectorAll<HTMLElement>('[aria-checked="true"]');
		expect(checkedItems.length).toBe(1);
	});

	test('multiple items can be selected in multiple mode', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'multiple',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'true');

		await user.keyboard(`{${kbd.ARROW_RIGHT}}`);
		expect(getByTestId(items[1])).toHaveFocus();
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');

		const root = getByTestId('root');
		const checkedItems = root.querySelectorAll<HTMLElement>('[aria-pressed="true"]');
		expect(checkedItems.length).toBe(2);
	});

	test('can uncheck items in single mode', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'true');
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[0])).toHaveAttribute('aria-checked', 'false');
	});

	test('can uncheck items in multiple mode', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'multiple',
			items,
		});

		getByTestId(items[0]).focus();
		expect(getByTestId(items[0])).toHaveFocus();
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'true');
		await user.keyboard(`{${kbd.SPACE}}`);
		expect(getByTestId(items[0])).toHaveAttribute('aria-pressed', 'false');
	});

	test('defaultValue is respected in single mode', async () => {
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
			defaultValue: items[1],
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-checked', 'true');
	});

	test('defaultValue is respected in multiple mode', async () => {
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'multiple',
			items,
			defaultValue: [items[1], items[2]],
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[2])).toHaveAttribute('aria-pressed', 'true');
	});

	test('value prop overrides defaultValue - single', async () => {
		const valueStore = writable<string>(items[1]);
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
			defaultValue: items[0],
			value: valueStore,
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-checked', 'true');
		expect(getByTestId(items[2])).not.toHaveAttribute('aria-checked', 'true');
	});

	test('value prop overrides defaultValue - multiple', async () => {
		const valueStore = writable<string[]>([items[1], items[2]]);
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'multiple',
			items,
			defaultValue: [items[0]],
			value: valueStore,
		});

		expect(getByTestId(items[0])).not.toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[1])).toHaveAttribute('aria-pressed', 'true');
		expect(getByTestId(items[2])).toHaveAttribute('aria-pressed', 'true');
	});

	test('value prop programmatically updates - single', async () => {
		const valueStore = writable<string>(items[1]);
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
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
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'multiple',
			items,
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
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'single',
			items,
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
		const user = userEvent.setup();
		const { getByTestId } = render(ToggleGroupTest, {
			type: 'multiple',
			items,
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
});
