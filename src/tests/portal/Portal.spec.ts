import { describe, it } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import PopoverTooltip from './PopoverTooltip.svelte';
import { sleep } from '$lib/internal/helpers/sleep.js';

function setupPopoverTooltip() {
	const user = userEvent.setup();
	const returned = render(PopoverTooltip);
	const popoverTrigger = returned.getByTestId('popover-trigger');
	const popoverContent = returned.getByTestId('popover-content');
	const tooltipTrigger = returned.getByTestId('tooltip-trigger');
	const tooltipContent = returned.getByTestId('tooltip-content');
	const outside = returned.getByTestId('outside');
	const elements = { popoverTrigger, popoverContent, tooltipTrigger, tooltipContent, outside };
	return { user, ...returned, elements };
}

describe('Portal Behaviors - Popover & Tooltip', () => {
	it('should not close the popover when the tooltip content is clicked', async () => {
		const { elements, user } = setupPopoverTooltip();

		expect(elements.popoverContent).not.toBeVisible();
		await user.click(elements.popoverTrigger);
		expect(elements.popoverContent).toBeVisible();
		expect(elements.tooltipContent).not.toBeVisible();
		await user.hover(elements.tooltipTrigger);
		expect(elements.tooltipContent).toBeVisible();
		await user.click(elements.tooltipContent);
		expect(elements.tooltipContent).toBeVisible();
		expect(elements.popoverContent).toBeVisible();
	});

	it('should close the tooltip content when the popover content is clicked and tooltip is open', async () => {
		const { elements, user } = setupPopoverTooltip();

		expect(elements.popoverContent).not.toBeVisible();
		await user.click(elements.popoverTrigger);
		expect(elements.popoverContent).toBeVisible();
		expect(elements.tooltipContent).not.toBeVisible();
		await user.hover(elements.tooltipTrigger);
		expect(elements.tooltipContent).toBeVisible();
		await user.click(elements.tooltipContent);
		expect(elements.tooltipContent).toBeVisible();
		expect(elements.popoverContent).toBeVisible();
		await user.click(elements.popoverContent);
		expect(elements.tooltipContent).not.toBeVisible();
		expect(elements.popoverContent).toBeVisible();
	});

	it('should close both tooltip and popover content when clicked outside of popover content', async () => {
		const { elements, user } = setupPopoverTooltip();

		expect(elements.popoverContent).not.toBeVisible();
		await user.click(elements.popoverTrigger);
		expect(elements.popoverContent).toBeVisible();
		expect(elements.tooltipContent).not.toBeVisible();
		await user.hover(elements.tooltipTrigger);
		expect(elements.tooltipContent).toBeVisible();
		await user.click(elements.tooltipContent);
		expect(elements.tooltipContent).toBeVisible();
		expect(elements.popoverContent).toBeVisible();
		await sleep(100);
		expect(elements.outside).toBeVisible();
		await user.click(elements.outside);
		await waitFor(() => expect(elements.tooltipContent).not.toBeVisible());
		await waitFor(() => expect(elements.popoverContent).not.toBeVisible());
	});
});
