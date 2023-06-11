import { expect, test } from '@playwright/experimental-ct-svelte';

import CollapsibleTest from './CollapsibleTest.svelte';
import { axeViolations } from '$test-helpers/axeTester.js';

test.describe('Collapsible', () => {
	test('No accesibility violations', async ({ mount, page }) => {
		await mount(CollapsibleTest);
		expect(await axeViolations(page)).toEqual([]);
	});

	test('Toggles when clicked', async ({ mount }) => {
		const cmp = await mount(CollapsibleTest);

		const trigger = await cmp.getByTestId('trigger');

		await expect(cmp).toBeVisible();

		await expect(cmp.getByTestId('content')).not.toBeVisible();
		await trigger.click();
		await expect(cmp.getByTestId('content')).toBeVisible();
		await trigger.click();
		await expect(cmp.getByTestId('content')).not.toBeVisible();
	});

	test('Should be open when open prop is true', async ({ mount }) => {
		const cmp = await mount(CollapsibleTest, { props: { open: true } });
		await expect(cmp.getByTestId('content')).toBeVisible();
	});
});
