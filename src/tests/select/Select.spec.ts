import '@testing-library/jest-dom';
import { render, act, fireEvent, waitFor } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { kbd, sleep } from '$lib/internal/helpers/index.js';
import SelectTest from './SelectTest.svelte';
import { tick } from 'svelte';

const OPEN_KEYS = [kbd.ENTER, kbd.SPACE];

describe('Select (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(SelectTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens/Closes when trigger is clicked', async () => {
		const { getByTestId } = await render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(getByTestId('menu')).toBeVisible();

		await user.click(trigger);
		await expect(menu).not.toBeVisible();
	});

	test.each(OPEN_KEYS)('Opens when %s is pressed', async (key) => {
		const { getByTestId } = await render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		await expect(menu).toBeVisible();
	});

	test.skip('Focus when opened with click', async () => {
		const { getByTestId } = await render(SelectTest);
		await tick();
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await expect(trigger).toBeVisible();
		await sleep(100);
		await fireEvent.click(trigger);
		await expect(menu).toBeVisible();

		const firstItem = getByTestId('sweet-option-0');
		await expect(firstItem).not.toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		// Focuses first item after arrow down
		await expect(firstItem).toHaveFocus();

		// Focuses next item after arrow down
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const secondItem = getByTestId('sweet-option-1');
		await expect(secondItem).toHaveFocus();

		// Doesn't focus disabled items
		await user.keyboard(`{${kbd.ARROW_DOWN}}`);
		const thirdItem = getByTestId('sweet-option-2');
		await expect(thirdItem).not.toHaveFocus();
	});

	test('Selects item when clicked', async () => {
		const { getByTestId } = await render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(trigger).not.toHaveTextContent('Caramel');

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(menu).toBeVisible();

		const firstItem = menu.querySelector('[data-melt-select-option]');
		if (!firstItem) throw new Error('No option found');
		await user.click(firstItem);

		await expect(menu).not.toBeVisible();
		await expect(trigger).toHaveTextContent('Caramel');

		await user.click(trigger);
		await expect(menu).toBeVisible();

		const secondItem = menu.querySelectorAll('[data-melt-select-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		await expect(menu).not.toBeVisible();
		await expect(trigger).toHaveTextContent('Chocolate');
	});

	test('Selects multiple items when `multiple` is true', async () => {
		const { getByTestId } = await render(SelectTest, { multiple: true });
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(trigger).not.toHaveTextContent('Caramel');

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(menu).toBeVisible();

		const firstItem = menu.querySelector('[data-melt-select-option]');
		if (!firstItem) throw new Error('No option found');
		await user.click(firstItem);

		await expect(firstItem).toHaveAttribute('data-selected');
		await expect(firstItem).toHaveAttribute('aria-selected', 'true');

		await expect(menu).toBeVisible();
		await expect(trigger).toHaveTextContent('Caramel');

		const secondItem = menu.querySelectorAll('[data-melt-select-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		await expect(secondItem).toHaveAttribute('data-selected');
		await expect(secondItem).toHaveAttribute('aria-selected', 'true');

		await expect(menu).toBeVisible();
		await expect(trigger).toHaveTextContent('Caramel, Chocolate');
	});

	test('Shows correct label when defaultValue is provided', async () => {
		const { getByTestId } = await render(SelectTest, { defaultValue: 'Chocolate' });
		const trigger = getByTestId('trigger');

		await expect(trigger).toHaveTextContent('Chocolate');
	});

	test('Manually setting the value updates the label', async () => {
		const { getByTestId } = await render(SelectTest);
		const manualBtn = getByTestId('manual-btn');
		const trigger = getByTestId('trigger');

		manualBtn.click();
		await waitFor(() => expect(trigger).toHaveTextContent('Chocolate'), { timeout: 50 });
	});

	test('Updating options and setting the value updates the label', async () => {
		const { getByTestId } = await render(SelectTest);
		const updateBtn = getByTestId('update-btn');
		const trigger = getByTestId('trigger');

		updateBtn.click();
		await waitFor(() => expect(trigger).toHaveTextContent('Vanilla'), { timeout: 500 });
	});

	test.todo('Disabled select cannot be opened');
	test.todo('Options loop when loop prop is set');
});
