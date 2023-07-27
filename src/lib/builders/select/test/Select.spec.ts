import { render, act } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { kbd } from '$lib/internal/helpers';
import SelectTest from './SelectTest.svelte';

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
		await expect(menu).toBeVisible();

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
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
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

	test.todo('Disabled select cannot be opened');
	test.todo('Options loop when loop prop is set');
});
