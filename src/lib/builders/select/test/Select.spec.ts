import { render, act } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { kbd } from '$lib/internal/helpers';
import SelectTest from './SelectTest.svelte';

const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

describe('Dropdown Menu (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(SelectTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Opens when trigger is clicked', async () => {
		const { getByTestId } = await render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(menu).toBeVisible();

		test('Closes when trigger is clicked while open', async () => {
			await user.click(trigger);
			await expect(menu).not.toBeVisible();
		});
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

		test(`Focuses first item when opened with ${key}`, async () => {
			const firstItem = getByTestId('option-0');
			await expect(firstItem).toHaveFocus();
		});
	});

	test('Focus when opened with click', async () => {
		const { getByTestId } = await render(SelectTest);
		const trigger = getByTestId('trigger');
		const menu = getByTestId('menu');
		const user = userEvent.setup();

		await expect(menu).not.toBeVisible();
		await user.click(trigger);
		await expect(menu).toBeVisible();

		const firstItem = getByTestId('sweet-option-1');
		await expect(firstItem).not.toHaveFocus();

		await user.keyboard(`{${kbd.ARROW_DOWN}}`);

		test('Focuses first item when arrow down is pressed', async () => {
			await expect(firstItem).toHaveFocus();
		});

		test('Focuses second item when arrow down is pressed on first item', async () => {
			await user.keyboard(`{${kbd.ARROW_DOWN}}`);
			const secondItem = getByTestId('sweet-option-2');
			await expect(secondItem).toHaveFocus();
		});
	});

	test.todo('Disabled options cannot be focused or selected');
	test.todo('Disabled select cannot be opened');
	test.todo('Options loop when loop prop is set');
});
