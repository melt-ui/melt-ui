import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import { describe } from 'vitest';
import CollapsibleTest from './CollapsibleTest.svelte';
import userEvent from '@testing-library/user-event';

describe('Collapsible', () => {
	test('No accessibility violations', async () => {
		const { container } = render(CollapsibleTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	test('Toggles when clicked', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CollapsibleTest);

		const trigger = getByTestId('trigger');

		expect(trigger).toBeVisible();

		expect(getByTestId('content')).not.toBeVisible();
		await user.click(trigger);
		expect(getByTestId('content')).toBeVisible();
		await user.click(trigger);
		expect(getByTestId('content')).not.toBeVisible();
	});

	test('Should be open when open prop is true', async () => {
		const { getByTestId } = render(CollapsibleTest, { open: true });
		expect(getByTestId('content')).toBeVisible();
	});

	test('Should be closed when open prop is false', async () => {
		const { getByTestId } = render(CollapsibleTest, { open: false });
		expect(getByTestId('content')).not.toBeVisible();
	});
});
