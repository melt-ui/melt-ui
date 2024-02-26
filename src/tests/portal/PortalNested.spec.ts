import { render, screen } from '@testing-library/svelte';
import { userEvent } from '@testing-library/user-event';
import PortalNestedTest, { structure, type Structure } from './PortalNested.svelte';

// Recursive function to test the components
const testComponent = async (component: Structure, level = 0) => {
	// Get the elements
	const trigger = screen.getByTestId(`${component.name}-trigger-${level}`);
	const content = screen.getByTestId(`${component.name}-content-${level}`);
	const outside = screen.getByTestId(`${component.name}-outside-${level}`);

	// At the root, the root trigger and outside should be visible, and the content  must not be.
	expect(trigger).toBeVisible();
	expect(outside).toBeVisible();
	expect(content).not.toBeVisible();

	// Click the trigger
	await userEvent.click(trigger);

	// After clicking the root trigger, all its elements must be visible.
	expect(trigger).toBeVisible();
	expect(content).toBeVisible();
	expect(outside).toBeVisible();

	// And all its immediate children triggers must be visible
	if (component.children) {
		for (const child of component.children) {
			const childTrigger = screen.getByTestId(`${child.name}-trigger-${level + 1}`);
			expect(childTrigger).toBeVisible();

			// The children of its children must all be invisible still
			if (child.children) {
				for (const grandChild of child.children) {
					const grandChildTrigger = screen.getByTestId(`${grandChild.name}-trigger-${level + 2}`);
					expect(grandChildTrigger).not.toBeVisible();
				}
			}

			// Recursively test the child components
			await testComponent(child, level + 1);
		}
	}

	// Testing closing
	// By clicking escape
	await userEvent.keyboard('{Escape}');
	expect(trigger).toBeVisible();
	expect(content).not.toBeVisible();
	expect(outside).toBeVisible();

	// Reopen
	// await userEvent.click(trigger);
	// expect(trigger).toBeVisible();
	// expect(content).toBeVisible();
	// expect(outside).toBeVisible();

	// By clicking outside
	// await userEvent.click(outside);
	// await sleep(500);
	// expect(trigger).toBeVisible();
	// expect(content).not.toBeVisible();
	// expect(outside).toBeVisible();
};

// Execute the test
test('recursive component test', async () => {
	await render(PortalNestedTest);
	await testComponent(structure);
});
