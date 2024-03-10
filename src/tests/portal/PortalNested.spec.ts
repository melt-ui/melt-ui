import { render, screen, waitFor } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import PortalNestedTest, { structure, type Structure } from './PortalNested.svelte';
import { testKbd as kbd } from '../utils.js';
import type { CreateDialogProps } from '$lib/index.js';

type UserEventUser = ReturnType<typeof userEvent.setup>;

// Recursive function to test the components
const testComponent = async (component: Structure, level: number, user: UserEventUser) => {
	// Get the elements
	const getTrigger = () => screen.getByTestId(`${component.name}-trigger-${level}`);
	const getContent = () => screen.getByTestId(`${component.name}-content-${level}`);
	const getOutside = () => screen.getByTestId(`${component.name}-outside-${level}`);

	// At the root, the root trigger and outside should be visible, and the content  must not be.
	waitFor(() => expect(getTrigger()).toBeVisible());
	waitFor(() => expect(getOutside()).toBeVisible());
	expect(getContent()).not.toBeVisible();

	// Click the trigger
	await user.click(getTrigger());

	// After clicking the root trigger, all its elements must be visible.
	waitFor(() => expect(getTrigger()).toBeVisible());
	waitFor(() => expect(getContent()).toBeVisible());
	waitFor(() => expect(getOutside()).toBeVisible());

	// And all its immediate children triggers must be visible
	for (const child of component.children ?? []) {
		const childTrigger = screen.getByTestId(`${child.name}-trigger-${level + 1}`);
		waitFor(() => expect(childTrigger).toBeVisible());

		// The children of its children must all be invisible still
		for (const grandChild of child.children ?? []) {
			const grandChildTrigger = screen.getByTestId(`${grandChild.name}-trigger-${level + 2}`);
			expect(grandChildTrigger).not.toBeVisible();
		}

		// Recursively test the child components
		await testComponent(child, level + 1, user);
	}

	// Testing closing
	// By clicking escape
	await user.keyboard(kbd.ESCAPE);
	waitFor(() => expect(getTrigger()).toBeVisible());
	waitFor(() => expect(getContent()).not.toBeVisible());
	waitFor(() => expect(getOutside()).toBeVisible());

	// Reopen
	await userEvent.click(getTrigger());
	waitFor(() => expect(getTrigger()).toBeVisible());
	waitFor(() => expect(getContent()).toBeVisible());
	waitFor(() => expect(getOutside()).toBeVisible());

	// By clicking outside
	await userEvent.click(getOutside());
	waitFor(() => expect(getTrigger()).toBeVisible());
	waitFor(() => expect(getContent()).not.toBeVisible());
	waitFor(() => expect(getOutside()).toBeVisible());
};

const portalTestOptions = [
	{ label: 'Sibling portals', portalType: 'body' },
	{ label: 'Single portal', portalType: undefined },
] satisfies { label: string; portalType: CreateDialogProps['portal'] }[];

// Execute the test
test.each(portalTestOptions)('recursive component test - $label', async ({ portalType }) => {
	const user = userEvent.setup();
	render(PortalNestedTest, { portal: portalType });
	await testComponent(structure, 0, user);
});
