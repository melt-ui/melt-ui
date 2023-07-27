import { render } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import HoverCardTest from './HoverCardTest.svelte';
import userEvent from '@testing-library/user-event';
import { sleep } from '../../../internal/helpers/sleep';

describe('HoverCard (Default)', () => {
	test('No accessibility violations', async () => {
		const { container } = await render(HoverCardTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	// TODO: Figure out why this isn't working
	test.todo('Opens on hover', async () => {
		const { getByTestId } = await render(HoverCardTest);
		const user = userEvent.setup();
		const trigger = getByTestId('trigger');
		const content = getByTestId('content');

		await expect(trigger).toBeVisible();
		await expect(content).not.toBeVisible();
		await user.hover(getByTestId('trigger'));
		await sleep(3000);
		await expect(content).toBeVisible();
	});
});
