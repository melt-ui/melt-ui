import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import DialogTest from './DialogTest.svelte';
import userEvent from '@testing-library/user-event';

describe('Dialog', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(DialogTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Toggles open state when clicked', async () => {
		const { getByTestId } = await render(DialogTest);

		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(content).not.toBeVisible();
		await userEvent.click(trigger);
		await expect(content).toBeVisible();
	});
});
