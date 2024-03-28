import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import PortalNestedTest, { structure, type Structure } from './PortalNested.svelte';
import { testKbd as kbd } from '../utils.js';
import type { CreateDialogProps } from '$lib/index.js';

type UserEventUser = ReturnType<typeof userEvent.setup>;

const assertNotVisibleOrNull = async (element: HTMLElement | null) => {
	if (element !== null) {
		expect(element).not.toBeVisible();
	} else {
		expect(element).toBeNull();
	}
};

// Recursive function to test the components
const testComponent = async (component: Structure, level: number, user: UserEventUser) => {
	// Get the elements
	const getTrigger = () => screen.getByTestId(`${component.name}-trigger-${level}`);
	const getContent = () => screen.queryByTestId(`${component.name}-content-${level}`);
	const getOutside = () => screen.getByTestId(`${component.name}-outside-${level}`);

	// At the root, the root trigger and outside should be visible, and the content  must not be.
	expect(getTrigger()).toBeVisible();
	expect(getOutside()).toBeVisible();
	assertNotVisibleOrNull(getContent());

	// Click the trigger
	await user.click(getTrigger());

	// After clicking the root trigger, all its elements must be visible.
	expect(getTrigger()).toBeVisible();
	expect(getContent()).toBeVisible();
	expect(getOutside()).toBeVisible();

	// And all its immediate children triggers must be visible
	for (const child of component.children ?? []) {
		const childTrigger = screen.getByTestId(`${child.name}-trigger-${level + 1}`);
		expect(childTrigger).toBeVisible();

		// The children of its children must all be invisible still
		for (const grandChild of child.children ?? []) {
			const grandChildTrigger = screen.queryByTestId(`${grandChild.name}-trigger-${level + 2}`);
			assertNotVisibleOrNull(grandChildTrigger);
		}

		await testComponent(child, level + 1, user);
	}

	expect(getContent()).toBeVisible();

	// Testing closing
	// By clicking escape
	await user.keyboard(kbd.ESCAPE);
	expect(getTrigger()).toBeVisible();
	assertNotVisibleOrNull(getContent());
	expect(getOutside()).toBeVisible();

	// Reopen
	await userEvent.click(getTrigger());
	expect(getTrigger()).toBeVisible();
	expect(getContent()).toBeVisible();
	expect(getOutside()).toBeVisible();

	// By clicking outside
	await userEvent.click(getOutside());
	expect(getTrigger()).toBeVisible();
	assertNotVisibleOrNull(getContent());
	expect(getOutside()).toBeVisible();
};

type PortalTestOption = {
	label: string;
	portalType: CreateDialogProps['portal'];
	forceVisible: CreateDialogProps['forceVisible'];
};

const portalTestOptions = [
	{ label: 'Sibling portals & forceVisible true', portalType: 'body', forceVisible: true },
	{ label: 'Sibling portals & forceVisible false', portalType: 'body', forceVisible: false },
	{ label: 'Single portal & forceVisible true', portalType: undefined, forceVisible: true },
	{ label: 'Single portal & forceVisible false', portalType: undefined, forceVisible: false },
] satisfies PortalTestOption[];

// Execute the test
test.each(portalTestOptions)(
	'recursive component test - $label forceVisible $forceVisible',
	async ({ portalType, forceVisible }) => {
		const user = userEvent.setup();
		render(PortalNestedTest, { portal: portalType, forceVisible });
		await testComponent(structure, 0, user);
	}
);
