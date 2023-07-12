import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DropdownMenuTest from './DropdownMenuTest.svelte';

describe('Collapsible', () => {
	test('No accesibility violations', async () => {
		const { container } = await render(DropdownMenuTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Toggles when clicked', async () => {
		const { getByTestId } = await render(DropdownMenuTest);

		const trigger = getByTestId('trigger');

		await expect(trigger).toBeVisible();

		await expect(getByTestId('menu')).not.toBeVisible();
		await trigger.click();
		await expect(getByTestId('menu')).toBeVisible();
		await trigger.click();
		await expect(getByTestId('menu')).not.toBeVisible();
	});
});
