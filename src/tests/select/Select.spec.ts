import { render, act, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { testKbd as kbd } from '../utils.js';
import SelectTest from './SelectTest.svelte';

const OPEN_KEYS = [kbd.ENTER, kbd.SPACE];

describe('Select', () => {
	test('No accessibility violations', async () => {
		const { container } = render(SelectTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens/Closes when trigger is clicked', async () => {
		const { getByTestId } = render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(getByTestId('menu')).toBeVisible();

		await user.click(trigger);
		expect(menu).not.toBeVisible();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(key);
		expect(menu).toBeVisible();
	});

	test('Toggles when trigger is clicked', async () => {
		const { getByTestId } = render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		await user.click(trigger);
		expect(menu).not.toBeVisible();
	});

	test('Toggles when icon within trigger is clicked', async () => {
		const { getByTestId } = render(SelectTest);
		const icon = getByTestId('icon');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(icon);
		expect(menu).toBeVisible();

		await user.click(icon);
		expect(menu).not.toBeVisible();
	});

	test('Selects item when clicked', async () => {
		const { getByTestId } = render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(trigger).not.toHaveTextContent('Caramel');

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const firstItem = menu.querySelector('[data-melt-select-option]');
		if (!firstItem) throw new Error('No option found');
		await user.click(firstItem);

		expect(menu).not.toBeVisible();
		expect(trigger).toHaveTextContent('Caramel');

		await user.click(trigger);
		expect(menu).toBeVisible();

		const secondItem = menu.querySelectorAll('[data-melt-select-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		expect(menu).not.toBeVisible();
		expect(trigger).toHaveTextContent('Chocolate');
	});

	test('Selects multiple items when `multiple` is true', async () => {
		const { getByTestId } = render(SelectTest, { multiple: true });
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(trigger).not.toHaveTextContent('Caramel');

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const firstItem = menu.querySelector('[data-melt-select-option]');
		if (!firstItem) throw new Error('No option found');
		await user.click(firstItem);

		expect(firstItem).toHaveAttribute('data-selected');
		expect(firstItem).toHaveAttribute('aria-selected', 'true');

		expect(menu).toBeVisible();
		expect(trigger).toHaveTextContent('Caramel');

		const secondItem = menu.querySelectorAll('[data-melt-select-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		expect(secondItem).toHaveAttribute('data-selected');
		expect(secondItem).toHaveAttribute('aria-selected', 'true');

		expect(menu).toBeVisible();
		expect(trigger).toHaveTextContent('Caramel, Chocolate');
	});

	test('Shows correct label when defaultValue is provided', async () => {
		const { getByTestId } = render(SelectTest, { defaultValue: 'Chocolate' });
		const trigger = getByTestId('trigger');

		expect(trigger).toHaveTextContent('Chocolate');
	});

	test('Manually setting the value updates the label', async () => {
		const { getByTestId } = render(SelectTest);
		const manualBtn = getByTestId('manual-btn');
		const trigger = getByTestId('trigger');

		manualBtn.click();
		await waitFor(() => expect(trigger).toHaveTextContent('Chocolate'), { timeout: 50 });
	});

	test('Updating options and setting the value updates the label', async () => {
		const { getByTestId } = render(SelectTest);
		const updateBtn = getByTestId('update-btn');
		const trigger = getByTestId('trigger');

		updateBtn.click();
		await waitFor(() => expect(trigger).toHaveTextContent('Vanilla'), { timeout: 500 });
	});

	test('Respects the `closeOnEscape` prop', async () => {
		const { getByTestId } = render(SelectTest, { closeOnEscape: false });
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		await user.keyboard(kbd.ESCAPE);
		expect(menu).toBeVisible();
	});

	test('Respects the `closeOnOutsideClick` prop', async () => {
		const { getByTestId } = render(SelectTest, { closeOnOutsideClick: false });
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		expect(menu).not.toBeVisible();
		await user.click(trigger);
		expect(menu).toBeVisible();

		const outside = getByTestId('outside');
		await user.click(outside);
		expect(menu).toBeVisible();
	});

	test('Applies custom ids when provided', async () => {
		const ids = {
			label: 'id-label',
			menu: 'id-menu',
			trigger: 'id-trigger',
		};

		const { getByTestId } = render(SelectTest, {
			ids,
		});

		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const label = getByTestId('label');
		expect(trigger.id).toBe(ids.trigger);
		expect(menu.id).toBe(ids.menu);
		expect(label.id).toBe(ids.label);
	});

	test.todo('Disabled select cannot be opened');
	test.todo('Options loop when loop prop is set');
});
