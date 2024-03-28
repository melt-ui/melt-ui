import { describe, it } from 'vitest';
import { render } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import PopoverTooltip from './PopoverTooltip.svelte';
import PopoverTagsInput from './PopoverTagsInput.svelte';
import PopoverSelect from './PopoverSelect.svelte';
import { testKbd as kbd } from '../utils.js';
import type { PortalConfig } from '$lib/internal/actions/portal.js';

function setupPopoverTooltip({
	portalType,
	tooltipCloseOnEscape,
}: {
	portalType: PortalConfig;
	tooltipCloseOnEscape?: boolean;
}) {
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

function setupPopoverTagsInput({ portalType }: { portalType: PortalConfig }) {
	const user = userEvent.setup();
	const returned = render(PopoverTagsInput, { portal: portalType });
	const popoverTrigger = returned.getByTestId('popover-trigger');
	const popoverContent = returned.getByTestId('popover-content');
	const getTag = (i: number) => returned.getByTestId(`tag-${i}`);
	const getEditTag = (i: number) => returned.getByTestId(`edit-tag-${i}`);
	const outside = returned.getByTestId('outside');
	const elements = { popoverTrigger, popoverContent, outside, getTag, getEditTag };
	return { user, ...returned, elements };
}

function setupPopoverSelect({ portalType }: { portalType: PortalConfig }) {
	const user = userEvent.setup();
	const returned = render(PopoverSelect, { portal: portalType });
	const popoverTrigger = returned.getByTestId('popover-trigger');
	const popoverContent = returned.getByTestId('popover-content');
	const selectTrigger = returned.getByTestId('select-trigger');
	const selectMenu = returned.getByTestId('select-menu');
	const outside = returned.getByTestId('outside');
	const elements = { popoverTrigger, popoverContent, outside, selectTrigger, selectMenu };
	return { user, ...returned, elements };
}

type PortalTestOption = { label: string; portalType: PortalConfig };

const portalTestOptions = [
	{ label: 'Sibling portals', portalType: 'body' },
	{ label: 'Single portal', portalType: undefined },
] satisfies PortalTestOption[];

describe.each(portalTestOptions)('Portal Behaviors - $label', ({ portalType }) => {
	describe('Popover & Tooltip', () => {
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
	});

	describe('Popover & Tags Input', () => {
		it('should not close popover on click outside while editing tag', async () => {
			const { user, elements } = setupPopoverTagsInput({ portalType });

			await user.click(elements.popoverTrigger);
			expect(elements.popoverContent).toBeVisible();
			await user.dblClick(elements.getTag(0));
			expect(elements.getEditTag(0)).toHaveFocus();
			await user.click(elements.outside);
			expect(elements.getEditTag(0)).not.toHaveFocus();
			expect(elements.popoverContent).toBeVisible();
		});

		it('should not close popover on escape while editing tag', async () => {
			const { user, elements } = setupPopoverTagsInput({ portalType });

			await user.click(elements.popoverTrigger);
			expect(elements.popoverContent).toBeVisible();
			await user.dblClick(elements.getTag(0));
			expect(elements.getEditTag(0)).toHaveFocus();
			await user.keyboard(kbd.ESCAPE);
			expect(elements.getEditTag(0)).not.toHaveFocus();
			expect(elements.popoverContent).toBeVisible();
		});
	});

	describe('Popover & Select', () => {
		it('should not deactivate popover focus trap on escape while select is open', async () => {
			const { user, elements } = setupPopoverSelect({ portalType });

			expect(elements.popoverContent).not.toBeVisible();
			await user.click(elements.popoverTrigger);
			expect(elements.popoverContent).toBeVisible();

			expect(elements.selectMenu).not.toBeVisible();
			await user.click(elements.selectTrigger);
			expect(elements.selectMenu).toBeVisible();

			await user.keyboard(kbd.ESCAPE);
			expect(elements.selectMenu).not.toBeVisible();
			expect(elements.popoverContent).toBeVisible();

			await user.tab({ shift: true });
			expect(elements.popoverTrigger).not.toHaveFocus();
		});

		it('should not deactivate popover focus trap on outside click while select is open', async () => {
			const { user, elements } = setupPopoverSelect({ portalType });

			expect(elements.popoverContent).not.toBeVisible();
			await user.click(elements.popoverTrigger);
			expect(elements.popoverContent).toBeVisible();

			expect(elements.selectMenu).not.toBeVisible();
			await user.click(elements.selectTrigger);
			expect(elements.selectMenu).toBeVisible();

			await user.click(elements.outside);
			expect(elements.selectMenu).not.toBeVisible();
			expect(elements.popoverContent).toBeVisible();

			await user.tab({ shift: true });
			expect(elements.popoverTrigger).not.toHaveFocus();
		});
	});
});
