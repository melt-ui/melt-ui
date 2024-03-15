import { describe, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import PopoverTooltip from './PopoverTooltip.svelte';
import { sleep } from '$lib/internal/helpers/sleep.js';
import type { CreateTooltipProps } from '$lib/index.js';
import { testKbd as kbd } from '../utils.js';

type Props = {
	portalType?: CreateTooltipProps['portal'];
	tooltipCloseOnEscape?: CreateTooltipProps['closeOnEscape'];
};

function setupPopoverTooltip({ portalType, tooltipCloseOnEscape }: Props = {}) {
	const user = userEvent.setup();
	const returned = render(PopoverTooltip, { portal: portalType, tooltipCloseOnEscape });
	const popoverTrigger = returned.getByTestId('popover-trigger');
	const popoverContent = returned.getByTestId('popover-content');
	const tooltipTrigger = returned.getByTestId('tooltip-trigger');
	const tooltipContent = returned.getByTestId('tooltip-content');
	const outside = returned.getByTestId('outside');
	const elements = { popoverTrigger, popoverContent, tooltipTrigger, tooltipContent, outside };
	return { user, ...returned, elements };
}

type PortalTestOption = { label: string; portalType: CreateTooltipProps['portal'] };

const portalTestOptions = [
	{ label: 'Sibling portals', portalType: 'body' },
	{ label: 'Single portal', portalType: undefined },
] satisfies PortalTestOption[];

describe.each(portalTestOptions)(
	'Portal Behaviors - Popover & Tooltip - $label',
	({ portalType }) => {
		it('should not close the popover when the tooltip content is clicked', async () => {
			const { elements, user } = setupPopoverTooltip({ portalType });

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
			const { elements, user } = setupPopoverTooltip({ portalType });

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
			const { elements, user } = setupPopoverTooltip({ portalType });

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
			expect(elements.tooltipContent).not.toBeVisible();
			expect(elements.popoverContent).not.toBeVisible();
		});

		it('should not close the popover when escape is pressed while tooltip is open', async () => {
			const { elements, user } = setupPopoverTooltip({ portalType });

			expect(elements.popoverContent).not.toBeVisible();
			await user.click(elements.popoverTrigger);
			expect(elements.popoverContent).toBeVisible();
			expect(elements.tooltipContent).not.toBeVisible();
			await user.hover(elements.tooltipTrigger);
			expect(elements.tooltipContent).toBeVisible();

			await user.keyboard(kbd.ESCAPE);
			expect(elements.tooltipContent).not.toBeVisible();
			expect(elements.popoverContent).toBeVisible();
			expect(elements.outside).toBeVisible();
			await user.click(elements.outside);
			expect(elements.tooltipContent).not.toBeVisible();
			expect(elements.popoverContent).not.toBeVisible();
		});

		it('should not close the popover nor the tooltip when escape is pressed while tooltip is open and tooltip `closeOnEscape` is false', async () => {
			const { elements, user } = setupPopoverTooltip({ portalType, tooltipCloseOnEscape: false });

			expect(elements.popoverContent).not.toBeVisible();
			await user.click(elements.popoverTrigger);
			expect(elements.popoverContent).toBeVisible();
			expect(elements.tooltipContent).not.toBeVisible();
			await user.hover(elements.tooltipTrigger);
			expect(elements.tooltipContent).toBeVisible();

			await user.keyboard(kbd.ESCAPE);
			expect(elements.tooltipContent).toBeVisible();
			expect(elements.popoverContent).toBeVisible();
		});
	}
);
