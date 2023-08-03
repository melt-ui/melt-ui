import '@testing-library/jest-dom';
import { render, act, fireEvent } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { kbd, sleep } from '$lib/internal/helpers';
import SelectTest from './SelectTest.svelte';
import { tick } from 'svelte';

const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

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

	test.each(OPEN_KEYS)('Opens when %s is pressed & focuses first item', async (key) => {
		const { getByTestId } = await render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await act(() => trigger.focus());
		await user.keyboard(`{${key}}`);
		await expect(menu).toBeVisible();

		const firstItem = getByTestId('sweet-option-0');
		await expect(firstItem).toHaveFocus();
	});

	test('Focus when opened with click', async () => {
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

		await expect(menu).not.toBeVisible();
		await expect(trigger).toHaveTextContent('Caramel');

		await user.click(trigger);
		await expect(menu).toBeVisible();

		const secondItem = menu.querySelectorAll('[data-melt-select-option]')[1];
		if (!secondItem) throw new Error('No option found');
		await user.click(secondItem);

		await expect(menu).not.toBeVisible();
		await expect(trigger).toHaveTextContent('Caramel, Chocolate');
	});

	test.todo('Disabled select cannot be opened');
	test.todo('Options loop when loop prop is set');
});
